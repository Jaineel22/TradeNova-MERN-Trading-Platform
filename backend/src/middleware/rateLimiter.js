// In-memory sliding-window rate limiter, generalizing the pattern already
// used by aiRateLimiter.js. Fine for a single-instance deployment; would
// need a shared store (e.g. Redis) behind a multi-instance/load-balanced
// deployment, which this project does not have.
function createRateLimiter({ windowMs, max, message, keyFn }) {
  const requestLog = new Map();

  return function rateLimiter(req, res, next) {
    const key = keyFn(req);
    const now = Date.now();

    const recent = (requestLog.get(key) || []).filter(
      (timestamp) => now - timestamp < windowMs
    );

    if (recent.length >= max) {
      return res.status(429).json({ message });
    }

    recent.push(now);
    requestLog.set(key, recent);
    next();
  };
}

const byIp = (req) => req.ip;
const byUser = (req) => req.user?.id || req.ip;

module.exports = { createRateLimiter, byIp, byUser };
