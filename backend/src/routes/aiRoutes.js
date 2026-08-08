const express = require("express");
const auth = require("../middleware/authMiddleware");
const aiRateLimiter = require("../middleware/aiRateLimiter");
const { ask } = require("../controllers/aiController");

const router = express.Router();

router.post("/ai/ask", auth, aiRateLimiter, ask);

module.exports = router;
