const request = require("supertest");
const app = require("../../src/app");

let counter = 0;

// Registers and logs in a fresh user, returning the token + id needed to
// act as them. Each call gets a unique email/username so tests can create
// as many independent accounts as a scenario needs (e.g. two-user IDOR
// tests) without colliding.
async function createAuthedUser(overrides = {}) {
  counter += 1;
  const username = overrides.username || `testuser${counter}`;
  const email = overrides.email || `testuser${counter}@example.com`;
  const password = overrides.password || "ValidPass123";

  await request(app).post("/register").send({ username, email, password });

  const loginRes = await request(app).post("/login").send({ email, password });

  return {
    token: loginRes.body.token,
    username,
    email,
    authHeader: `Bearer ${loginRes.body.token}`,
  };
}

module.exports = { createAuthedUser };
