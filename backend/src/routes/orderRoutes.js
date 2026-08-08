const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  allHoldings,
  allPositions,
  newOrder,
  funds,
  allOrders,
} = require("../controllers/orderController");

const router = express.Router();

router.get("/allHoldings", auth, allHoldings);
router.get("/allPositions", auth, allPositions);
router.post("/newOrder", auth, newOrder);
router.get("/funds", auth, funds);
router.get("/allOrders", auth, allOrders);

module.exports = router;
