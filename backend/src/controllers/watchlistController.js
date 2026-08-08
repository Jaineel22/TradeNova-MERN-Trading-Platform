const {
  getWatchlist,
  addSymbol,
  removeSymbol,
} = require("../services/watchlistService");

async function list(req, res, next) {
  try {
    const items = await getWatchlist(req.user.id);
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function add(req, res, next) {
  try {
    const result = await addSymbol(req.user.id, req.body.symbol);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const result = await removeSymbol(req.user.id, req.params.symbol);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, add, remove };
