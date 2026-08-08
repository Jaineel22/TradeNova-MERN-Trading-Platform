const Watchlist = require("../models/Watchlist");
const { normalizeSymbol } = require("../validators/marketValidators");

function makeError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function getWatchlist(userId) {
  const items = await Watchlist.find({ userId }).sort({ _id: 1 });
  return items.map((item) => ({ symbol: item.symbol }));
}

async function addSymbol(userId, symbolInput) {
  const symbol = normalizeSymbol(symbolInput);
  if (!symbol) {
    throw makeError("Invalid stock symbol", 400);
  }

  const existing = await Watchlist.findOne({ userId, symbol });
  if (existing) {
    throw makeError("Symbol already exists in watchlist", 400);
  }

  try {
    await Watchlist.create({ userId, symbol });
  } catch (err) {
    if (err.code === 11000) {
      throw makeError("Symbol already exists in watchlist", 400);
    }
    throw err;
  }

  return { message: "Symbol added to watchlist", symbol };
}

async function removeSymbol(userId, symbolInput) {
  const symbol = normalizeSymbol(symbolInput);
  if (!symbol) {
    throw makeError("Invalid stock symbol", 400);
  }

  const result = await Watchlist.deleteOne({ userId, symbol });

  if (result.deletedCount === 0) {
    throw makeError("Symbol not found in watchlist", 404);
  }

  return { message: "Symbol removed from watchlist", symbol };
}

module.exports = { getWatchlist, addSymbol, removeSymbol };
