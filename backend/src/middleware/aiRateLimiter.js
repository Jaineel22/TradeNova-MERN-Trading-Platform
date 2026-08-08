const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;

const requestLog = new Map();

module.exports = function aiRateLimiter(req, res, next) {
  const userId = req.user.id;
  const now = Date.now();

  const recent = (requestLog.get(userId) || []).filter(
    (timestamp) => now - timestamp < WINDOW_MS
  );

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      message: "Too many AI assistant requests. Please wait a few minutes and try again.",
    });
  }

  recent.push(now);
  requestLog.set(userId, recent);
  next();
};
