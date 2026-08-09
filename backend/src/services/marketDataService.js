const YahooFinance = require("yahoo-finance2").default;
const { normalizeSymbol } = require("../validators/marketValidators");

const REQUEST_TIMEOUT_MS = 8000;
const CACHE_TTL_MS = 45 * 1000;
const HISTORY_CACHE_TTL_MS = 5 * 60 * 1000;

// Interval choice trades off resolution against Yahoo's intraday history
// limits: 15m/60m bars are only kept for a short rolling window, so short
// ranges use them, while longer ranges fall back to daily/weekly bars.
const HISTORY_RANGE_CONFIG = {
  "1D": { days: 1, interval: "15m" },
  "1W": { days: 7, interval: "60m" },
  "1M": { days: 30, interval: "1d" },
  "3M": { days: 90, interval: "1d" },
  "1Y": { days: 365, interval: "1wk" },
};

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

const quoteCache = new Map();
const historyCache = new Map();

class QuoteTimeoutError extends Error {}

function makeError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(
        () => reject(new QuoteTimeoutError("Market data provider request timed out")),
        timeoutMs
      );
    }),
  ]);
}

function isQualifiedSymbol(symbol) {
  return symbol.includes(".") || symbol.startsWith("^");
}

async function attemptQuote(symbol) {
  const result = await withTimeout(yahooFinance.quote(symbol), REQUEST_TIMEOUT_MS);
  return result || null;
}

// Bare symbols are resolved against the NSE listing first: TradeNova is an
// Indian-market platform, and a bare ticker can silently match an unrelated
// security on another exchange (e.g. "INFY" alone resolves to a NYSE ADR,
// not the NSE-listed stock). Already-qualified symbols ("INFY.NS",
// "RELIANCE.BO") and index symbols ("^NSEI") are queried as given. If the
// NSE lookup fails (not found, or a transient provider error), we fall back
// to the bare symbol as typed - this is what keeps non-Indian tickers like
// "AAPL"/"MSFT" working without any special-casing.
async function resolveQuote(symbol) {
  if (isQualifiedSymbol(symbol)) {
    return attemptQuote(symbol);
  }

  try {
    const nseQuote = await attemptQuote(`${symbol}.NS`);
    if (nseQuote) {
      return nseQuote;
    }
  } catch (err) {
    // Fall through to the bare-symbol attempt below.
  }

  return attemptQuote(symbol);
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

  let quote;
  try {
    quote = await resolveQuote(symbol);
  } catch (err) {
    if (err instanceof QuoteTimeoutError) {
      throw makeError("Market data provider is unavailable", 503);
    }
    throw makeError("Market data provider is unavailable", 502);
  }

  if (!quote || !Number.isFinite(quote.regularMarketPrice)) {
    throw makeError(`No market data found for symbol "${symbol}"`, 404);
  }

  const price = quote.regularMarketPrice;
  const changePercent = Number.isFinite(quote.regularMarketChangePercent)
    ? quote.regularMarketChangePercent
    : 0;
  const change = Number.isFinite(quote.regularMarketChange)
    ? quote.regularMarketChange
    : price * (changePercent / 100);
  const timestamp =
    quote.regularMarketTime instanceof Date
      ? quote.regularMarketTime.toISOString()
      : new Date().toISOString();

  const normalized = {
    symbol: quote.symbol || symbol,
    price,
    change,
    changePercent,
    timestamp,
  };

  quoteCache.set(symbol, { data: normalized, expiresAt: Date.now() + CACHE_TTL_MS });

  return normalized;
}

async function attemptChart(symbol, options) {
  const result = await withTimeout(yahooFinance.chart(symbol, options), REQUEST_TIMEOUT_MS);
  return result || null;
}

// Mirrors resolveQuote's NSE-first strategy for bare symbols so chart data
// stays consistent with the quote a user is already looking at.
async function resolveChart(symbol, options) {
  if (isQualifiedSymbol(symbol)) {
    return attemptChart(symbol, options);
  }

  try {
    const nseResult = await attemptChart(`${symbol}.NS`, options);
    if (nseResult && nseResult.quotes?.length) {
      return nseResult;
    }
  } catch (err) {
    // Fall through to the bare-symbol attempt below.
  }

  return attemptChart(symbol, options);
}

async function getHistory(symbolInput, rangeInput) {
  const symbol = normalizeSymbol(symbolInput);
  if (!symbol) {
    throw makeError("Invalid stock symbol", 400);
  }

  const range = HISTORY_RANGE_CONFIG[rangeInput] ? rangeInput : "1M";
  const config = HISTORY_RANGE_CONFIG[range];

  const cacheKey = `${symbol}:${range}`;
  const cached = historyCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const period1 = new Date(Date.now() - config.days * 24 * 60 * 60 * 1000);

  let chartResult;
  try {
    chartResult = await resolveChart(symbol, { period1, interval: config.interval, return: "array" });
  } catch (err) {
    if (err instanceof QuoteTimeoutError) {
      throw makeError("Market data provider is unavailable", 503);
    }
    if (/no data found/i.test(err.message || "")) {
      throw makeError(`No historical data found for symbol "${symbol}"`, 404);
    }
    throw makeError("Market data provider is unavailable", 502);
  }

  const points = (chartResult?.quotes || [])
    .filter((q) => Number.isFinite(q.close))
    .map((q) => ({ date: q.date.toISOString(), close: q.close }));

  if (points.length === 0) {
    throw makeError(`No historical data found for symbol "${symbol}"`, 404);
  }

  const normalized = {
    symbol: chartResult.meta?.symbol || symbol,
    range,
    points,
  };

  historyCache.set(cacheKey, { data: normalized, expiresAt: Date.now() + HISTORY_CACHE_TTL_MS });

  return normalized;
}

module.exports = { getQuote, getHistory };
