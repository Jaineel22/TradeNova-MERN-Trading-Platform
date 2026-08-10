// Runs once per test file. Spins up a real, in-process MongoDB (no external
// network/database), so tests exercise real Mongoose behaviour (unique
// indexes, atomic findOneAndUpdate guards, etc.) without touching any
// developer/production database. Collections are wiped between individual
// tests within a file so tests don't leak state into each other.
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-not-for-production";

// The Phase 6 rate limiters key pre-auth requests by req.ip. Every Supertest
// request in a test file shares one synthetic IP and one in-memory app
// instance, so a file that creates several test users (register + login
// each) would otherwise trip the limiter and derail unrelated tests with
// cascading 401s. This does not disable the limiter - it uses the same
// env-based configuration the middleware already supports (see
// rateLimiter.js/authRoutes.js) to raise the ceiling to something realistic
// for a test *file's* worth of traffic. The limiter's actual
// trigger-at-threshold behaviour is verified for real in
// tests/integration/rateLimiting.test.js with its own low limits.
process.env.LOGIN_RATE_LIMIT_MAX = process.env.LOGIN_RATE_LIMIT_MAX || "1000";
process.env.REGISTER_RATE_LIMIT_MAX = process.env.REGISTER_RATE_LIMIT_MAX || "1000";
process.env.ORDER_RATE_LIMIT_MAX = process.env.ORDER_RATE_LIMIT_MAX || "1000";

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
}, 60000);

afterEach(async () => {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
});
