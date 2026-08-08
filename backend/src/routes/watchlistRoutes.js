const express = require("express");
const auth = require("../middleware/authMiddleware");
const { list, add, remove } = require("../controllers/watchlistController");

const router = express.Router();

router.get("/watchlist", auth, list);
router.post("/watchlist", auth, add);
router.delete("/watchlist/:symbol", auth, remove);

module.exports = router;
