const Holding = require("../models/Holding");
const User = require("../models/User");
const marketDataService = require("./marketDataService");

function makeError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function priceHolding(holding) {
  const investedValue = holding.qty * holding.avg;

  try {
    const quote = await marketDataService.getQuote(holding.name);

    return {
      symbol: holding.name,
      quantity: holding.qty,
      averagePrice: holding.avg,
      currentPrice: quote.price,
      investedValue,
      currentValue: holding.qty * quote.price,
      pnl: holding.qty * quote.price - investedValue,
      priceAvailable: true,
    };
  } catch (err) {
    // Market data unavailable for this symbol (unsupported symbol, provider
    // rate-limited, provider down, etc). Fall back to the invested value so
    // the portfolio total stays meaningful without fabricating a price.
    return {
      symbol: holding.name,
      quantity: holding.qty,
      averagePrice: holding.avg,
      currentPrice: null,
      investedValue,
      currentValue: investedValue,
      pnl: 0,
      priceAvailable: false,
    };
  }
}

async function getPortfolioSummary(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw makeError("User not found", 404);
  }

  const holdings = await Holding.find({ userId });

  const pricedHoldings = await Promise.all(holdings.map(priceHolding));

  const totalInvested = pricedHoldings.reduce((sum, h) => sum + h.investedValue, 0);
  const currentValue = pricedHoldings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalPnL = currentValue - totalInvested;
  const pnlPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  const holdingsWithAllocation = pricedHoldings.map((h) => ({
    ...h,
    allocation: currentValue > 0 ? (h.currentValue / currentValue) * 100 : 0,
  }));

  return {
    cashBalance: user.balance,
    totalInvested,
    currentValue,
    totalPnL,
    pnlPercent,
    totalAccountValue: user.balance + currentValue,
    holdings: holdingsWithAllocation,
  };
}

module.exports = { getPortfolioSummary };
