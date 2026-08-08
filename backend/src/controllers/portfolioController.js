const { getPortfolioSummary } = require("../services/portfolioService");

async function summary(req, res, next) {
  try {
    const result = await getPortfolioSummary(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { summary };
