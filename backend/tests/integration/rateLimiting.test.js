// Exercises the exact reusable rate-limiter module that authRoutes.js and
// orderRoutes.js both wire up (createRateLimiter), through a minimal
// standalone Express app. This proves the trigger-at-threshold mechanism
// itself works, without going through the full app/DB stack - the global
// test setup deliberately raises the *real* app's limits (see
// setupAfterEnv.js) so the rest of the suite can create many test users
// without tripping them, so this is the test that actually proves the
// underlying mechanism still functions correctly.
const express = require("express");
const request = require("supertest");
const { createRateLimiter, byIp } = require("../../src/middleware/rateLimiter");

function buildTestApp(max) {
  const app = express();
  app.set("trust proxy", true); // mirrors app.js, so X-Forwarded-For drives req.ip below
  const limiter = createRateLimiter({
    windowMs: 60_000,
    max,
    message: "Too many requests, slow down.",
    keyFn: byIp,
  });
  app.get("/limited", limiter, (req, res) => res.json({ ok: true }));
  return app;
}

test("allows requests up to the configured limit, then blocks with 429", async () => {
  const app = buildTestApp(3);

  const first = await request(app).get("/limited");
  const second = await request(app).get("/limited");
  const third = await request(app).get("/limited");
  const fourth = await request(app).get("/limited");

  expect(first.status).toBe(200);
  expect(second.status).toBe(200);
  expect(third.status).toBe(200);
  expect(fourth.status).toBe(429);
  expect(fourth.body.message).toBe("Too many requests, slow down.");
});

test("tracks separate clients independently", async () => {
  const app = buildTestApp(1);

  const clientA1 = await request(app).get("/limited").set("X-Forwarded-For", "1.1.1.1");
  const clientA2 = await request(app).get("/limited").set("X-Forwarded-For", "1.1.1.1");
  const clientB1 = await request(app).get("/limited").set("X-Forwarded-For", "2.2.2.2");

  expect(clientA1.status).toBe(200);
  expect(clientA2.status).toBe(429); // same client, over its own limit
  expect(clientB1.status).toBe(200); // different client, unaffected
});
