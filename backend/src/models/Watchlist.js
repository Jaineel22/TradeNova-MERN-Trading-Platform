const mongoose = require("mongoose");
const { Schema } = mongoose;

const WatchlistSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
});

WatchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model("Watchlist", WatchlistSchema, "watchlists");
