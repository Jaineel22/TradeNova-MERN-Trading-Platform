const express = require("express");
const auth = require("../middleware/authMiddleware");
const { quote } = require("../controllers/marketController");

const router = express.Router();

router.get("/quote/:symbol", auth, quote);

module.exports = router;
