const request = require("supertest");
const app = require("../../src/app");
const { createAuthedUser } = require("../helpers/testUser");

describe("GET /watchlist", () => {
  test("rejects an unauthenticated request", async () => {
    const res = await request(app).get("/watchlist");
    expect(res.status).toBe(401);
  });

  test("returns an empty list for a new user", async () => {
    const user = await createAuthedUser();
    const res = await request(app).get("/watchlist").set("Authorization", user.authHeader);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("POST /watchlist", () => {
  test("adds a valid symbol", async () => {
    const user = await createAuthedUser();
    const res = await request(app).post("/watchlist").set("Authorization", user.authHeader).send({ symbol: "tcs" });

    expect(res.status).toBe(200);
    expect(res.body.symbol).toBe("TCS"); // normalized

    const list = await request(app).get("/watchlist").set("Authorization", user.authHeader);
    expect(list.body).toEqual([{ symbol: "TCS" }]);
  });

  test("rejects a malformed symbol", async () => {
    const user = await createAuthedUser();
    const res = await request(app).post("/watchlist").set("Authorization", user.authHeader).send({ symbol: "<script>alert(1)</script>" });
    expect(res.status).toBe(400);
  });

  test("rejects a duplicate symbol", async () => {
    const user = await createAuthedUser();
    await request(app).post("/watchlist").set("Authorization", user.authHeader).send({ symbol: "TCS" });

    const res = await request(app).post("/watchlist").set("Authorization", user.authHeader).send({ symbol: "TCS" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  test("rejects an unauthenticated request", async () => {
    const res = await request(app).post("/watchlist").send({ symbol: "TCS" });
    expect(res.status).toBe(401);
  });
});

describe("DELETE /watchlist/:symbol", () => {
  test("removes an existing symbol", async () => {
    const user = await createAuthedUser();
    await request(app).post("/watchlist").set("Authorization", user.authHeader).send({ symbol: "TCS" });

    const res = await request(app).delete("/watchlist/TCS").set("Authorization", user.authHeader);
    expect(res.status).toBe(200);

    const list = await request(app).get("/watchlist").set("Authorization", user.authHeader);
    expect(list.body).toEqual([]);
  });

  test("returns 404 for a symbol not in the watchlist", async () => {
    const user = await createAuthedUser();
    const res = await request(app).delete("/watchlist/GOOG").set("Authorization", user.authHeader);
    expect(res.status).toBe(404);
  });

  test("rejects an unauthenticated request", async () => {
    const res = await request(app).delete("/watchlist/TCS");
    expect(res.status).toBe(401);
  });
});
