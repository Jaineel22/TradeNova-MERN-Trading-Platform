// Each test uses its own symbol (or advances the clock past the 45s quote
// cache TTL when it deliberately wants a price to change) for the same
// reason documented in trading.test.js: marketDataService's quote cache is a
// module-level Map that persists across tests within this file.
const { mockQuote, fixtureQuote } = require("../mocks/yahooFinance");
const request = require("supertest");
const app = require("../../src/app");
const { createAuthedUser } = require("../helpers/testUser");

beforeEach(() => {
  mockQuote.mockReset();
  mockQuote.mockResolvedValue(fixtureQuote());
});

describe("GET /portfolio/summary", () => {
  test("rejects an unauthenticated request", async () => {
    const res = await request(app).get("/portfolio/summary");
    expect(res.status).toBe(401);
  });

  test("returns zeroed totals and no holdings for a fresh account", async () => {
    const user = await createAuthedUser();

    const res = await request(app).get("/portfolio/summary").set("Authorization", user.authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      cashBalance: 100000,
      totalInvested: 0,
      currentValue: 0,
      totalPnL: 0,
      pnlPercent: 0,
      totalAccountValue: 100000,
      holdings: [],
    });
  });

  test("computes invested/current value, P&L, P&L% and allocation from a real holding at the live price", async () => {
    const user = await createAuthedUser();
    const realNow = Date.now;

    await request(app).post("/newOrder").set("Authorization", user.authHeader).send({ name: "PRICECHG", qty: 10, mode: "BUY" });

    // The market price moves before we check the portfolio summary; advance
    // past the quote cache TTL so the new mocked price actually gets used.
    jest.spyOn(Date, "now").mockImplementation(() => realNow() + 46_000);
    mockQuote.mockResolvedValue(fixtureQuote({ regularMarketPrice: 2600 }));
    const res = await request(app).get("/portfolio/summary").set("Authorization", user.authHeader);
    Date.now.mockRestore();

    expect(res.status).toBe(200);
    const invested = 10 * 2452.7;
    const current = 10 * 2600;
    expect(res.body.totalInvested).toBeCloseTo(invested, 5);
    expect(res.body.currentValue).toBeCloseTo(current, 5);
    expect(res.body.totalPnL).toBeCloseTo(current - invested, 5);
    expect(res.body.pnlPercent).toBeCloseTo(((current - invested) / invested) * 100, 5);
    expect(res.body.cashBalance).toBeCloseTo(100000 - invested, 5);
    expect(res.body.totalAccountValue).toBeCloseTo(res.body.cashBalance + current, 5);

    expect(res.body.holdings).toHaveLength(1);
    expect(res.body.holdings[0]).toMatchObject({
      symbol: "PRICECHG",
      quantity: 10,
      averagePrice: 2452.7,
      currentPrice: 2600,
      priceAvailable: true,
      allocation: 100,
    });
  });

  test("falls back to invested value (not a fabricated price) when the market-data provider fails for a held symbol", async () => {
    const user = await createAuthedUser();
    const realNow = Date.now;

    await request(app).post("/newOrder").set("Authorization", user.authHeader).send({ name: "PROVFAIL", qty: 5, mode: "BUY" });

    // Advance past the cache TTL so the summary request actually re-queries
    // the (now failing) provider instead of reusing the successful buy's
    // cached quote.
    jest.spyOn(Date, "now").mockImplementation(() => realNow() + 46_000);
    mockQuote.mockRejectedValue(new Error("provider down"));
    const res = await request(app).get("/portfolio/summary").set("Authorization", user.authHeader);
    Date.now.mockRestore();

    expect(res.status).toBe(200);
    const invested = 5 * 2452.7;
    expect(res.body.holdings[0]).toMatchObject({
      priceAvailable: false,
      currentPrice: null,
      currentValue: invested, // falls back to invested value, never a made-up price
      pnl: 0,
    });
    expect(res.body.totalPnL).toBe(0);
  });

  test("splits allocation proportionally across multiple holdings", async () => {
    const user = await createAuthedUser();

    mockQuote.mockResolvedValue(fixtureQuote({ symbol: "ALLOCA.NS", regularMarketPrice: 100 }));
    await request(app).post("/newOrder").set("Authorization", user.authHeader).send({ name: "ALLOCA", qty: 10, mode: "BUY" }); // value 1000

    mockQuote.mockResolvedValue(fixtureQuote({ symbol: "ALLOCB.NS", regularMarketPrice: 100 }));
    await request(app).post("/newOrder").set("Authorization", user.authHeader).send({ name: "ALLOCB", qty: 30, mode: "BUY" }); // value 3000

    const res = await request(app).get("/portfolio/summary").set("Authorization", user.authHeader);

    expect(res.status).toBe(200);
    const a = res.body.holdings.find((h) => h.symbol === "ALLOCA");
    const b = res.body.holdings.find((h) => h.symbol === "ALLOCB");
    expect(a.allocation).toBeCloseTo(25, 1); // 1000 / 4000
    expect(b.allocation).toBeCloseTo(75, 1); // 3000 / 4000
  });
});
