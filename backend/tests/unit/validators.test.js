const { validateRegisterInput } = require("../../src/validators/authValidators");
const { validateNewOrderInput } = require("../../src/validators/orderValidators");
const { normalizeSymbol, normalizeRange } = require("../../src/validators/marketValidators");
const { validateQuestion, MAX_QUESTION_LENGTH } = require("../../src/validators/aiValidators");

describe("validateRegisterInput", () => {
  const valid = { username: "gooduser", email: "good@example.com", password: "ValidPass123" };

  test("accepts a valid registration", () => {
    expect(validateRegisterInput(valid)).toBeNull();
  });

  test("rejects missing fields", () => {
    expect(validateRegisterInput({ email: "a@b.com", password: "ValidPass123" })).toMatch(/required/i);
    expect(validateRegisterInput({ username: "a", password: "ValidPass123" })).toMatch(/required/i);
    expect(validateRegisterInput({ username: "a", email: "a@b.com" })).toMatch(/required/i);
  });

  test("rejects a malformed email", () => {
    expect(validateRegisterInput({ ...valid, email: "not-an-email" })).toMatch(/valid email/i);
  });

  test("rejects a username with invalid characters or bad length", () => {
    expect(validateRegisterInput({ ...valid, username: "ab" })).toMatch(/username/i);
    expect(validateRegisterInput({ ...valid, username: "has spaces" })).toMatch(/username/i);
    expect(validateRegisterInput({ ...valid, username: "a".repeat(31) })).toMatch(/username/i);
  });

  test("rejects a password shorter than 8 characters", () => {
    expect(validateRegisterInput({ ...valid, password: "short1" })).toMatch(/8 characters/i);
  });

  test("rejects a password longer than 128 characters", () => {
    expect(validateRegisterInput({ ...valid, password: "a".repeat(129) })).toMatch(/128 characters/i);
  });
});

describe("validateNewOrderInput", () => {
  const valid = { name: "TCS", qty: 10, mode: "BUY" };

  test("accepts a valid order", () => {
    expect(validateNewOrderInput(valid)).toBeNull();
  });

  test("rejects missing fields", () => {
    expect(validateNewOrderInput({ qty: 10, mode: "BUY" })).toMatch(/required/i);
  });

  test("rejects an invalid mode", () => {
    expect(validateNewOrderInput({ ...valid, mode: "HOLD" })).toMatch(/BUY or SELL/);
  });

  test("rejects zero, negative, non-integer, NaN and Infinity quantities", () => {
    expect(validateNewOrderInput({ ...valid, qty: 0 })).toMatch(/positive/i);
    expect(validateNewOrderInput({ ...valid, qty: -5 })).toMatch(/positive/i);
    expect(validateNewOrderInput({ ...valid, qty: 1.5 })).toMatch(/whole number/i);
    expect(validateNewOrderInput({ ...valid, qty: NaN })).toMatch(/positive/i);
    expect(validateNewOrderInput({ ...valid, qty: Infinity })).toMatch(/positive/i);
  });

  test("rejects quantity above the maximum", () => {
    expect(validateNewOrderInput({ ...valid, qty: 10_000_000 })).toMatch(/exceeds maximum/i);
  });

  test("rejects an empty symbol", () => {
    expect(validateNewOrderInput({ ...valid, name: "   " })).toMatch(/non-empty string/i);
  });
});

describe("normalizeSymbol", () => {
  test("uppercases and trims a plain ticker", () => {
    expect(normalizeSymbol(" tcs ")).toBe("TCS");
  });

  test("accepts qualified exchange symbols and indices", () => {
    expect(normalizeSymbol("infy.ns")).toBe("INFY.NS");
    expect(normalizeSymbol("^nsei")).toBe("^NSEI");
  });

  test("rejects symbols with disallowed characters (injection-shaped input)", () => {
    expect(normalizeSymbol("TCS; DROP TABLE")).toBeNull();
    expect(normalizeSymbol("<script>")).toBeNull();
    expect(normalizeSymbol("")).toBeNull();
  });

  test("rejects non-string input", () => {
    expect(normalizeSymbol(123)).toBeNull();
    expect(normalizeSymbol(null)).toBeNull();
    expect(normalizeSymbol(undefined)).toBeNull();
  });
});

describe("normalizeRange", () => {
  test("accepts a valid range", () => {
    expect(normalizeRange("1w")).toBe("1W");
  });

  test("falls back to 1M for an invalid or missing range", () => {
    expect(normalizeRange("bogus")).toBe("1M");
    expect(normalizeRange(undefined)).toBe("1M");
  });
});

describe("validateQuestion", () => {
  test("accepts a normal question", () => {
    expect(validateQuestion("What is my balance?")).toBeNull();
  });

  test("rejects a missing or empty question", () => {
    expect(validateQuestion(undefined)).toMatch(/required/i);
    expect(validateQuestion("   ")).toMatch(/required/i);
  });

  test("rejects a question over the length limit", () => {
    expect(validateQuestion("a".repeat(MAX_QUESTION_LENGTH + 1))).toMatch(/characters or fewer/i);
  });
});
