const SYMBOL_PATTERN = /^[A-Z0-9.\-]{1,15}$/;

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

module.exports = { normalizeSymbol };
