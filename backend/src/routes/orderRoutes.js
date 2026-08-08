const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  allHoldings,
  allPositions,
  newOrder,
  funds,
} = require("../controllers/orderController");

const router = express.Router();

router.get("/allHoldings", auth, allHoldings);
router.get("/allPositions", auth, allPositions);
router.post("/newOrder", auth, newOrder);
router.get("/funds", auth, funds);

module.exports = router;
