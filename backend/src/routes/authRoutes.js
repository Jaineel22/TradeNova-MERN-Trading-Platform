const express = require("express");
const { register, login } = require("../controllers/authController");
const { createRateLimiter, byIp } = require("../middleware/rateLimiter");

const router = express.Router();

// Keyed by IP (pre-authentication, no user identity yet). Login is stricter
// than register since credential-stuffing is the higher-value attack.
const loginLimiter = createRateLimiter({
  windowMs: Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.LOGIN_RATE_LIMIT_MAX) || 10,
  message: "Too many login attempts. Please wait a few minutes and try again.",
  keyFn: byIp,
});

const registerLimiter = createRateLimiter({
  windowMs: Number(process.env.REGISTER_RATE_LIMIT_WINDOW_MS) || 60 * 60 * 1000,
  max: Number(process.env.REGISTER_RATE_LIMIT_MAX) || 5,
  message: "Too many signup attempts from this network. Please try again later.",
  keyFn: byIp,
});

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);

module.exports = router;
