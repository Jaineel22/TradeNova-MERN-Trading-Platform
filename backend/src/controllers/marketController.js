const { getQuote } = require("../services/marketDataService");
const { normalizeSymbol } = require("../validators/marketValidators");

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

module.exports = { quote };
