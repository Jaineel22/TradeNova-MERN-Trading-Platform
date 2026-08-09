// Strips Yahoo Finance exchange qualifiers (e.g. "TCS.NS" -> "TCS") so the
// UI shows the symbol the user actually searched for, not provider internals.
// Index symbols ("^NSEI") are left untouched.
export const displaySymbol = (symbol = "") => symbol.replace(/\.(NS|BO)$/i, "");
