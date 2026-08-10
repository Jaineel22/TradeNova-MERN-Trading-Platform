// Each test below uses its own symbol, even where the flow is otherwise
// identical - marketDataService caches quotes/history per symbol for its own
// TTL, and that cache is a module-level Map that persists for the lifetime
// of this test file's process. Reusing a symbol across tests would silently
// serve an earlier test's cached (mocked) result instead of exercising the
// new mock, which is exactly what happened before this was split out.
const { mockQuote, mockChart, fixtureQuote } = require("../mocks/yahooFinance");
const request = require("supertest");
const app = require("../../src/app");
const { createAuthedUser } = require("../helpers/testUser");

beforeEach(() => {
  mockQuote.mockReset();
  mockChart.mockReset();
});

describe("GET /quote/:symbol", () => {
  test("rejects an unauthenticated request", async () => {
    const res = await request(app).get("/quote/TCS");
    expect(res.status).toBe(401);
  });

  test("returns a normalized quote for a valid symbol, without hitting the network", async () => {
    mockQuote.mockResolvedValue(fixtureQuote());
    const user = await createAuthedUser();

    const res = await request(app).get("/quote/TCS").set("Authorization", user.authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      symbol: "TCS.NS",
      price: 2452.7,
      change: 79.7,
    });
    expect(typeof res.body.timestamp).toBe("string");
  });

  test("rejects a malformed symbol before ever calling the market-data provider", async () => {
    const user = await createAuthedUser();
    const res = await request(app).get("/quote/;DROP--TABLE").set("Authorization", user.authHeader);

    expect(res.status).toBe(400);
    expect(mockQuote).not.toHaveBeenCalled();
  });

  test("returns 404 when the provider has no data for the symbol", async () => {
    mockQuote.mockResolvedValue(null);
    const user = await createAuthedUser();

    const res = await request(app).get("/quote/ZZZINVALID").set("Authorization", user.authHeader);

    expect(res.status).toBe(404);
  });

  test("returns a 502 (not a 500/stack trace) when the provider errors", async () => {
    mockQuote.mockRejectedValue(new Error("provider down"));
    const user = await createAuthedUser();

    const res = await request(app).get("/quote/PROVDOWN").set("Authorization", user.authHeader);

    expect(res.status).toBe(502);
    expect(res.body.message).not.toMatch(/provider down/i);
  });
});

describe("GET /market/history/:symbol", () => {
  test("returns normalized history points for a valid symbol", async () => {
    mockChart.mockResolvedValue({
      meta: { symbol: "TCS.NS" },
      quotes: [
        { date: new Date("2026-07-01T00:00:00Z"), close: 2400 },
        { date: new Date("2026-07-02T00:00:00Z"), close: 2420 },
      ],
    });
    const user = await createAuthedUser();

    const res = await request(app)
      .get("/market/history/TCS")
      .query({ range: "1M" })
      .set("Authorization", user.authHeader);

    expect(res.status).toBe(200);
    expect(res.body.range).toBe("1M");
    expect(res.body.points).toHaveLength(2);
    expect(res.body.points[0].close).toBe(2400);
  });

  test("falls back to 1M for an invalid range instead of erroring", async () => {
    mockChart.mockResolvedValue({
      meta: { symbol: "RANGEFALLBACK.NS" },
      quotes: [{ date: new Date(), close: 2400 }],
    });
    const user = await createAuthedUser();

    const res = await request(app)
      .get("/market/history/RANGEFALLBACK")
      .query({ range: "not-a-real-range" })
      .set("Authorization", user.authHeader);

    expect(res.status).toBe(200);
    expect(res.body.range).toBe("1M");
  });

  test("returns 404 when no historical points are available", async () => {
    mockChart.mockResolvedValue({ meta: {}, quotes: [] });
    const user = await createAuthedUser();

    const res = await request(app).get("/market/history/NODATA").set("Authorization", user.authHeader);

    expect(res.status).toBe(404);
  });
});
