const request = require("supertest");
const app = require("../../src/app");

describe("POST /register", () => {
  test("registers a valid new user", async () => {
    const res = await request(app)
      .post("/register")
      .send({ username: "alice", email: "alice@example.com", password: "ValidPass123" });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/registered successfully/i);
  });

  test("rejects a weak password", async () => {
    const res = await request(app)
      .post("/register")
      .send({ username: "weakpw", email: "weakpw@example.com", password: "abc" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/8 characters/i);
  });

  test("rejects a malformed email", async () => {
    const res = await request(app)
      .post("/register")
      .send({ username: "bademail", email: "not-an-email", password: "ValidPass123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/valid email/i);
  });

  test("rejects duplicate email, case-insensitively, without leaking a raw database error", async () => {
    await request(app)
      .post("/register")
      .send({ username: "original", email: "Dup@Example.com", password: "ValidPass123" });

    const res = await request(app)
      .post("/register")
      .send({ username: "different", email: "dup@example.com", password: "ValidPass123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already in use/i);
    expect(res.body.message).not.toMatch(/E11000|MongoServerError|collection:/i);
  });

  test("rejects duplicate username with a different email", async () => {
    await request(app)
      .post("/register")
      .send({ username: "sameuser", email: "first@example.com", password: "ValidPass123" });

    const res = await request(app)
      .post("/register")
      .send({ username: "sameuser", email: "second@example.com", password: "ValidPass123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already in use/i);
  });
});

describe("POST /login", () => {
  beforeEach(async () => {
    await request(app)
      .post("/register")
      .send({ username: "loginuser", email: "login@example.com", password: "ValidPass123" });
  });

  test("logs in with valid credentials and returns a token", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "login@example.com", password: "ValidPass123" });

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
    expect(res.body.token.split(".")).toHaveLength(3); // looks like a JWT
    expect(res.body.username).toBe("loginuser");
  });

  test("login is case-insensitive on email", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "LOGIN@EXAMPLE.COM", password: "ValidPass123" });

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
  });

  test("rejects a wrong password with a generic message", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "login@example.com", password: "WrongPassword1" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  test("rejects a nonexistent email with the SAME generic message (no user enumeration)", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "doesnotexist@example.com", password: "WrongPassword1" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  test("rejects malformed login input", async () => {
    const res = await request(app).post("/login").send({ email: "login@example.com" });
    expect(res.status).toBe(400);
  });
});

describe("Protected routes", () => {
  test("reject requests with no Authorization header", async () => {
    const res = await request(app).get("/funds");
    expect(res.status).toBe(401);
  });

  test("reject requests with a malformed token", async () => {
    const res = await request(app).get("/funds").set("Authorization", "Bearer not-a-real-token");
    expect(res.status).toBe(401);
  });

  test("accept requests with a valid token", async () => {
    await request(app)
      .post("/register")
      .send({ username: "protecteduser", email: "protected@example.com", password: "ValidPass123" });
    const loginRes = await request(app)
      .post("/login")
      .send({ email: "protected@example.com", password: "ValidPass123" });

    const res = await request(app)
      .get("/funds")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(100000);
  });
});
