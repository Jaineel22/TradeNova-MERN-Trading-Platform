const express = require("express");
const auth = require("../middleware/authMiddleware");
const { summary } = require("../controllers/portfolioController");

const router = express.Router();

router.get("/portfolio/summary", auth, summary);

module.exports = router;
