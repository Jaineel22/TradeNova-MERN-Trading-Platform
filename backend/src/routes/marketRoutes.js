const express = require("express");
const auth = require("../middleware/authMiddleware");
const { quote, history } = require("../controllers/marketController");

const router = express.Router();

router.get("/quote/:symbol", auth, quote);
router.get("/market/history/:symbol", auth, history);

module.exports = router;
