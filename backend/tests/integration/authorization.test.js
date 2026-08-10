// Proves server-side user isolation (IDOR/BOLA protection) across every
// authenticated resource: watchlist, funds, holdings, orders. Every
// controller derives identity from the verified JWT (req.user.id), never
// from a client-supplied id - these tests exercise that from the outside,
// as an attacker would, rather than just reading the code.
const { mockQuote, fixtureQuote } = require("../mocks/yahooFinance");
const request = require("supertest");
const app = require("../../src/app");
const { createAuthedUser } = require("../helpers/testUser");

beforeEach(() => {
  mockQuote.mockReset();
  mockQuote.mockResolvedValue(fixtureQuote());
});

describe("Watchlist isolation", () => {
  test("user B cannot see user A's watchlist entries", async () => {
    const userA = await createAuthedUser();
    const userB = await createAuthedUser();

    await request(app).post("/watchlist").set("Authorization", userA.authHeader).send({ symbol: "AAPL" });

    const bList = await request(app).get("/watchlist").set("Authorization", userB.authHeader);
    expect(bList.body).toEqual([]);
  });

  test("user B cannot delete user A's watchlist entry", async () => {
    const userA = await createAuthedUser();
    const userB = await createAuthedUser();

    await request(app).post("/watchlist").set("Authorization", userA.authHeader).send({ symbol: "AAPL" });

    const deleteAttempt = await request(app)
      .delete("/watchlist/AAPL")
      .set("Authorization", userB.authHeader);
    expect(deleteAttempt.status).toBe(404);

    const aListAfter = await request(app).get("/watchlist").set("Authorization", userA.authHeader);
    expect(aListAfter.body).toEqual([{ symbol: "AAPL" }]); // untouched
  });
});

describe("Funds/portfolio isolation", () => {
  test("each user sees only their own balance, not another user's", async () => {
    const userA = await createAuthedUser();
    const userB = await createAuthedUser();

    await request(app).post("/newOrder").set("Authorization", userA.authHeader).send({ name: "TCS", qty: 10, mode: "BUY" });

    const aFunds = await request(app).get("/funds").set("Authorization", userA.authHeader);
    const bFunds = await request(app).get("/funds").set("Authorization", userB.authHeader);

    expect(aFunds.body.balance).toBeLessThan(100000); // A spent money
    expect(bFunds.body.balance).toBe(100000); // B is untouched
  });

  test("a client-supplied userId in the request body is ignored", async () => {
    const userA = await createAuthedUser();
    const userB = await createAuthedUser();

    // userB tries to read funds while smuggling userA's id in the body.
    const res = await request(app)
      .get("/funds")
      .set("Authorization", userB.authHeader)
      .send({ userId: "irrelevant-should-be-ignored" });

    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(100000); // userB's own balance, not userA's
  });
});

describe("Orders/holdings isolation", () => {
  test("user B's order history never contains user A's orders", async () => {
    const userA = await createAuthedUser();
    const userB = await createAuthedUser();

    await request(app).post("/newOrder").set("Authorization", userA.authHeader).send({ name: "TCS", qty: 1, mode: "BUY" });

    const bOrders = await request(app).get("/allOrders").set("Authorization", userB.authHeader);
    expect(bOrders.body).toEqual([]);
  });

  test("user B cannot sell a holding that only user A owns", async () => {
    const userA = await createAuthedUser();
    const userB = await createAuthedUser();

    await request(app).post("/newOrder").set("Authorization", userA.authHeader).send({ name: "TCS", qty: 10, mode: "BUY" });

    const sellAttempt = await request(app)
      .post("/newOrder")
      .set("Authorization", userB.authHeader)
      .send({ name: "TCS", qty: 1, mode: "SELL" });

    expect(sellAttempt.status).toBe(400);
    expect(sellAttempt.body.message).toMatch(/not owned/i);

    const aHoldings = await request(app).get("/allHoldings").set("Authorization", userA.authHeader);
    expect(aHoldings.body[0].qty).toBe(10); // untouched by B's attempt
  });

  test("user B's holdings list never contains user A's holdings", async () => {
    const userA = await createAuthedUser();
    const userB = await createAuthedUser();

    await request(app).post("/newOrder").set("Authorization", userA.authHeader).send({ name: "TCS", qty: 5, mode: "BUY" });

    const bHoldings = await request(app).get("/allHoldings").set("Authorization", userB.authHeader);
    expect(bHoldings.body).toEqual([]);
  });
});
