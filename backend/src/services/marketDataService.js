const { normalizeSymbol } = require("../validators/marketValidators");

const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";
const REQUEST_TIMEOUT_MS = 8000;
const CACHE_TTL_MS = 45 * 1000;

const quoteCache = new Map();

function makeError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function getQuote(symbolInput) {
  const symbol = normalizeSymbol(symbolInput);
  if (!symbol) {
    throw makeError("Invalid stock symbol", 400);
  }

  const cached = quoteCache.get(symbol);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const apiKey = process.env.MARKET_DATA_API_KEY;
  if (!apiKey) {
    throw makeError("Market data provider is not configured", 503);
  }

  const url = `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(
    symbol
  )}&apikey=${apiKey}`;

  let response;
  try {
    response = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS);
  } catch (err) {
    throw makeError("Market data provider is unavailable", 503);
  }

  if (!response.ok) {
    throw makeError("Market data provider is unavailable", 502);
  }

  let body;
  try {
    body = await response.json();
  } catch (err) {
    throw makeError("Received an invalid response from the market data provider", 502);
  }

  if (body.Note || body.Information) {
    throw makeError(
      "Market data provider rate limit reached, please try again shortly",
      429
    );
  }

  const quote = body["Global Quote"];
  const rawPrice = quote && quote["05. price"];

  if (!quote || !rawPrice) {
    throw makeError(`No market data found for symbol "${symbol}"`, 404);
  }

  const price = parseFloat(rawPrice);
  const change = parseFloat(quote["09. change"]);
  const changePercent = parseFloat(String(quote["10. change percent"] || "0").replace("%", ""));

  if (!Number.isFinite(price)) {
    throw makeError("Received an invalid response from the market data provider", 502);
  }

  const normalized = {
    symbol,
    price,
    change: Number.isFinite(change) ? change : 0,
    changePercent: Number.isFinite(changePercent) ? changePercent : 0,
    timestamp: new Date().toISOString(),
  };

  quoteCache.set(symbol, { data: normalized, expiresAt: Date.now() + CACHE_TTL_MS });

  return normalized;
}

module.exports = { getQuote };
