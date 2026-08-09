const { getQuote, getHistory } = require("../services/marketDataService");
const { normalizeSymbol, normalizeRange } = require("../validators/marketValidators");

async function quote(req, res, next) {
  try {
    const symbol = normalizeSymbol(req.params.symbol);
    if (!symbol) {
      return res.status(400).json({ message: "Invalid stock symbol" });
    }

    const data = await getQuote(symbol);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function history(req, res, next) {
  try {
    const symbol = normalizeSymbol(req.params.symbol);
    if (!symbol) {
      return res.status(400).json({ message: "Invalid stock symbol" });
    }

    const range = normalizeRange(req.query.range);
    const data = await getHistory(symbol, range);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { quote, history };
