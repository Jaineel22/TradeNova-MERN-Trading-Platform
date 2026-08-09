// Allows plain tickers (AAPL), qualified exchange symbols (INFY.NS, RELIANCE.BO),
// and Yahoo Finance index symbols (^NSEI, ^BSESN).
const SYMBOL_PATTERN = /^\^?[A-Z0-9.\-]{1,15}$/;

function normalizeSymbol(symbol) {
  if (typeof symbol !== "string") {
    return null;
  }

  const trimmed = symbol.trim().toUpperCase();

  if (!SYMBOL_PATTERN.test(trimmed)) {
    return null;
  }

  return trimmed;
}

const HISTORY_RANGES = ["1D", "1W", "1M", "3M", "1Y"];

function normalizeRange(range) {
  if (typeof range !== "string") {
    return "1M";
  }

  const upper = range.trim().toUpperCase();
  return HISTORY_RANGES.includes(upper) ? upper : "1M";
}

module.exports = { normalizeSymbol, normalizeRange, HISTORY_RANGES };
