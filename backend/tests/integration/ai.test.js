const { mockGenerateContent, MockApiError } = require("../mocks/gemini");
const request = require("supertest");
const app = require("../../src/app");
const { createAuthedUser } = require("../helpers/testUser");

beforeEach(() => {
  mockGenerateContent.mockReset();
  process.env.GEMINI_API_KEY = "test-fake-key-not-real";
});

describe("POST /ai/ask", () => {
  test("rejects an unauthenticated request without ever calling Gemini", async () => {
    const res = await request(app).post("/ai/ask").send({ question: "What is my balance?" });

    expect(res.status).toBe(401);
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test("rejects a missing question without calling Gemini", async () => {
    const user = await createAuthedUser();
    const res = await request(app).post("/ai/ask").set("Authorization", user.authHeader).send({});

    expect(res.status).toBe(400);
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test("rejects an overlong question without calling Gemini", async () => {
    const user = await createAuthedUser();
    const res = await request(app)
      .post("/ai/ask")
      .set("Authorization", user.authHeader)
      .send({ question: "a".repeat(501) });

    expect(res.status).toBe(400);
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test("returns the mocked answer for a valid authenticated question", async () => {
    mockGenerateContent.mockResolvedValue({ text: "Your available balance is 100000." });
    const user = await createAuthedUser();

    const res = await request(app)
      .post("/ai/ask")
      .set("Authorization", user.authHeader)
      .send({ question: "What is my balance?" });

    expect(res.status).toBe(200);
    expect(res.body.answer).toBe("Your available balance is 100000.");
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });

  test("sends only the authenticated user's own account context to the model", async () => {
    mockGenerateContent.mockResolvedValue({ text: "ok" });
    const userA = await createAuthedUser();
    const userB = await createAuthedUser();

    // Give A a distinctive balance so we can prove B's request doesn't
    // reference it.
    await request(app).post("/newOrder").set("Authorization", userA.authHeader).send({ name: "TCS", qty: 1, mode: "BUY" }).catch(() => {});

    await request(app)
      .post("/ai/ask")
      .set("Authorization", userB.authHeader)
      .send({ question: "What is my balance?" });

    const callArgs = mockGenerateContent.mock.calls[0][0];
    expect(callArgs.contents).toContain(userB.username);
    expect(callArgs.contents).not.toContain(userA.username);
    expect(callArgs.contents).toContain("100000"); // B's own untouched balance
  });

  test("a client cannot override the account context to see another user's data", async () => {
    mockGenerateContent.mockResolvedValue({ text: "ok" });
    const userA = await createAuthedUser();
    const userB = await createAuthedUser();

    await request(app)
      .post("/ai/ask")
      .set("Authorization", userB.authHeader)
      .send({ question: "What is my balance?", userId: userA.username, accountId: "someone-else" });

    const callArgs = mockGenerateContent.mock.calls[0][0];
    expect(callArgs.contents).toContain(userB.username);
    expect(callArgs.contents).not.toContain(userA.username);
  });

  test("returns a clean 503 if Gemini returns an auth/config error, without leaking details", async () => {
    mockGenerateContent.mockRejectedValue(Object.assign(new MockApiError("invalid api key", 401), {}));
    const user = await createAuthedUser();

    const res = await request(app)
      .post("/ai/ask")
      .set("Authorization", user.authHeader)
      .send({ question: "What is my balance?" });

    expect(res.status).toBe(503);
    expect(res.body.message).not.toMatch(/api.?key/i);
  });

  test("returns a 429 if Gemini itself rate-limits the request", async () => {
    mockGenerateContent.mockRejectedValue(new MockApiError("rate limited", 429));
    const user = await createAuthedUser();

    const res = await request(app)
      .post("/ai/ask")
      .set("Authorization", user.authHeader)
      .send({ question: "What is my balance?" });

    expect(res.status).toBe(429);
  });

  test("returns a clean 503 on an unexpected/timeout-style failure", async () => {
    mockGenerateContent.mockRejectedValue(new Error("socket hang up"));
    const user = await createAuthedUser();

    const res = await request(app)
      .post("/ai/ask")
      .set("Authorization", user.authHeader)
      .send({ question: "What is my balance?" });

    expect(res.status).toBe(503);
    expect(res.body.message).not.toMatch(/socket/i);
  });
});

// Not covered here: askPortfolioAssistant's "AI assistant is not configured"
// (503) path, which only fires when GEMINI_API_KEY is unset at the moment
// aiService's module-scoped client is first created. Since that client is
// cached for the lifetime of the process, it can't be deterministically
// exercised alongside the tests above without reloading the module in
// isolation - not worth the added complexity for one error branch that's
// already covered by the "unexpected failure" and "auth/config error" cases
// above in terms of response shape (clean message, no leaked detail).
