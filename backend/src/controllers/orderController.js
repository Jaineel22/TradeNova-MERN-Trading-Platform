const {
  getHoldings,
  getPositions,
  getFunds,
  getOrders,
  executeOrder,
} = require("../services/tradingService");

async function allHoldings(req, res, next) {
  try {
    const holdings = await getHoldings(req.user.id);
    res.json(holdings);
  } catch (err) {
    next(err);
  }
}

async function allPositions(req, res, next) {
  try {
    const positions = await getPositions(req.user.id);
    res.json(positions);
  } catch (err) {
    next(err);
  }
}

async function newOrder(req, res, next) {
  try {
    const result = await executeOrder(req.user.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function funds(req, res, next) {
  try {
    const result = await getFunds(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function allOrders(req, res, next) {
  try {
    const orders = await getOrders(req.user.id);
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

module.exports = { allHoldings, allPositions, newOrder, funds, allOrders };
