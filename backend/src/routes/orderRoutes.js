const express = require("express");
const auth = require("../middleware/authMiddleware");
const { createRateLimiter, byUser } = require("../middleware/rateLimiter");
const {
  allHoldings,
  allPositions,
  newOrder,
  funds,
  allOrders,
} = require("../controllers/orderController");

const router = express.Router();

// Keyed by authenticated user (runs after `auth`). Generous enough not to
// interfere with normal rapid trading/testing, tight enough to stop an
// automated order-spam loop.
const orderLimiter = createRateLimiter({
  windowMs: Number(process.env.ORDER_RATE_LIMIT_WINDOW_MS) || 60 * 1000,
  max: Number(process.env.ORDER_RATE_LIMIT_MAX) || 60,
  message: "Too many orders placed too quickly. Please slow down.",
  keyFn: byUser,
});

router.get("/allHoldings", auth, allHoldings);
router.get("/allPositions", auth, allPositions);
router.post("/newOrder", auth, orderLimiter, newOrder);
router.get("/funds", auth, funds);
router.get("/allOrders", auth, allOrders);

module.exports = router;
