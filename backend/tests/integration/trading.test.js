const { mockQuote, fixtureQuote } = require("../mocks/yahooFinance");
const request = require("supertest");
const app = require("../../src/app");
const { createAuthedUser } = require("../helpers/testUser");

beforeEach(() => {
  mockQuote.mockReset();
  mockQuote.mockResolvedValue(fixtureQuote());
});

describe("BUY", () => {
  test("executes at the live quote price, deducts balance, creates a holding and an order", async () => {
    const user = await createAuthedUser();

    const res = await request(app)
      .post("/newOrder")
      .set("Authorization", user.authHeader)
      .send({ name: "TCS", qty: 10, mode: "BUY" });

    expect(res.status).toBe(200);
    expect(res.body.order.price).toBe(2452.7);
    expect(res.body.order.qty).toBe(10);
    expect(res.body.order.mode).toBe("BUY");
    expect(res.body.balance).toBeCloseTo(100000 - 10 * 2452.7, 5);

    const holdings = await request(app).get("/allHoldings").set("Authorization", user.authHeader);
    expect(holdings.body).toHaveLength(1);
    expect(holdings.body[0]).toMatchObject({ name: "TCS", qty: 10, avg: 2452.7 });

    const funds = await request(app).get("/funds").set("Authorization", user.authHeader);
    expect(funds.body.balance).toBeCloseTo(100000 - 10 * 2452.7, 5);
  });

  test("ignores a client-supplied price and always uses the live quote", async () => {
    const user = await createAuthedUser();

    const res = await request(app)
      .post("/newOrder")
      .set("Authorization", user.authHeader)
      .send({ name: "TCS", qty: 1, mode: "BUY", price: 0.01 });

    expect(res.status).toBe(200);
    expect(res.body.order.price).toBe(2452.7); // not the fabricated 0.01
  });

  test("rejects a buy that exceeds the available balance", async () => {
    const user = await createAuthedUser();

    const res = await request(app)
      .post("/newOrder")
      .set("Authorization", user.authHeader)
      .send({ name: "TCS", qty: 1000, mode: "BUY" }); // 1000 * 2452.70 >> 100000

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/insufficient funds/i);

    const funds = await request(app).get("/funds").set("Authorization", user.authHeader);
    expect(funds.body.balance).toBe(100000); // untouched
  });

  test("averages cost correctly across two buys of the same symbol", async () => {
    const user = await createAuthedUser();
    const realNow = Date.now;

    await request(app).post("/newOrder").set("Authorization", user.authHeader).send({ name: "TCS", qty: 10, mode: "BUY" });

    // marketDataService caches a quote for 45s; without advancing the clock,
    // this second buy would silently reuse the first quote from cache
    // instead of exercising the mock's new price, and the averaging math
    // being tested here would never actually run against two different
    // prices.
    jest.spyOn(Date, "now").mockImplementation(() => realNow() + 46_000);
    mockQuote.mockResolvedValue(fixtureQuote({ regularMarketPrice: 2552.7 }));
    await request(app).post("/newOrder").set("Authorization", user.authHeader).send({ name: "TCS", qty: 10, mode: "BUY" });
    Date.now.mockRestore();

    const holdings = await request(app).get("/allHoldings").set("Authorization", user.authHeader);
    expect(holdings.body).toHaveLength(1);
    expect(holdings.body[0].qty).toBe(20);
    expect(holdings.body[0].avg).toBeCloseTo((2452.7 + 2552.7) / 2, 5);
  });

  test("rejects invalid quantity and invalid symbol before touching the balance", async () => {
    const user = await createAuthedUser();

    const negQty = await request(app).post("/newOrder").set("Authorization", user.authHeader).send({ name: "TCS", qty: -5, mode: "BUY" });
    expect(negQty.status).toBe(400);

    const badSymbol = await request(app).post("/newOrder").set("Authorization", user.authHeader).send({ name: "bad symbol!", qty: 1, mode: "BUY" });
    expect(badSymbol.status).toBe(400);

    const funds = await request(app).get("/funds").set("Authorization", user.authHeader);
    expect(funds.body.balance).toBe(100000);
  });

  test("rejects an unauthenticated order", async () => {
    const res = await request(app).post("/newOrder").send({ name: "TCS", qty: 1, mode: "BUY" });
    expect(res.status).toBe(401);
  });
});

describe("SELL", () => {
  async function buy(user, qty = 10) {
    await request(app).post("/newOrder").set("Authorization", user.authHeader).send({ name: "TCS", qty, mode: "BUY" });
  }

  test("sells owned quantity, credits balance, reduces the holding", async () => {
    const user = await createAuthedUser();
    await buy(user, 10);

    const res = await request(app)
      .post("/newOrder")
      .set("Authorization", user.authHeader)
      .send({ name: "TCS", qty: 4, mode: "SELL" });

    expect(res.status).toBe(200);
    expect(res.body.order.mode).toBe("SELL");

    const holdings = await request(app).get("/allHoldings").set("Authorization", user.authHeader);
    expect(holdings.body[0].qty).toBe(6);
  });

  test("deletes the holding once fully sold", async () => {
    const user = await createAuthedUser();
    await buy(user, 10);

    await request(app).post("/newOrder").set("Authorization", user.authHeader).send({ name: "TCS", qty: 10, mode: "SELL" });

    const holdings = await request(app).get("/allHoldings").set("Authorization", user.authHeader);
    expect(holdings.body).toHaveLength(0);

    const funds = await request(app).get("/funds").set("Authorization", user.authHeader);
    expect(funds.body.balance).toBe(100000); // back to starting balance
  });

  test("rejects selling more than owned", async () => {
    const user = await createAuthedUser();
    await buy(user, 5);

    const res = await request(app)
      .post("/newOrder")
      .set("Authorization", user.authHeader)
      .send({ name: "TCS", qty: 6, mode: "SELL" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/insufficient quantity/i);
  });

  test("rejects selling a symbol never owned", async () => {
    const user = await createAuthedUser();

    const res = await request(app)
      .post("/newOrder")
      .set("Authorization", user.authHeader)
      .send({ name: "INFY", qty: 1, mode: "SELL" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/not owned/i);
  });
});

describe("GET /allOrders", () => {
  test("returns the user's orders, newest first", async () => {
    const user = await createAuthedUser();
    await request(app).post("/newOrder").set("Authorization", user.authHeader).send({ name: "TCS", qty: 1, mode: "BUY" });
    await request(app).post("/newOrder").set("Authorization", user.authHeader).send({ name: "TCS", qty: 1, mode: "SELL" });

    const res = await request(app).get("/allOrders").set("Authorization", user.authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].mode).toBe("SELL"); // most recent first
    expect(res.body[1].mode).toBe("BUY");
  });
});
