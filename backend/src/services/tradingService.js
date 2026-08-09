const Holding = require("../models/Holding");
const Order = require("../models/Order");
const Position = require("../models/Position");
const User = require("../models/User");
const { validateNewOrderInput } = require("../validators/orderValidators");
const { normalizeSymbol } = require("../validators/marketValidators");
const marketDataService = require("./marketDataService");

function makeError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function getHoldings(userId) {
  return Holding.find({ userId });
}

async function getPositions(userId) {
  return Position.find({ userId });
}

async function getOrders(userId) {
  return Order.find({ userId }).sort({ createdAt: -1 });
}

async function getFunds(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw makeError("User not found", 404);
  }

  const holdings = await Holding.find({ userId });
  const investedValue = holdings.reduce(
    (sum, holding) => sum + holding.qty * holding.avg,
    0
  );

  return {
    balance: user.balance,
    investedValue,
    totalAccountValue: user.balance + investedValue,
  };
}

async function executeOrder(userId, { name, qty, mode }) {
  const validationError = validateNewOrderInput({ name, qty, mode });
  if (validationError) {
    throw makeError(validationError, 400);
  }

  const symbol = normalizeSymbol(name);
  if (!symbol) {
    throw makeError("Invalid stock symbol", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw makeError("User not found", 404);
  }

  // Execution price always comes from the live quote, never from the
  // client, so an order can't be placed at a fabricated price.
  let quote;
  try {
    quote = await marketDataService.getQuote(symbol);
  } catch (err) {
    throw makeError(`Unable to execute order: ${err.message}`, err.status || 502);
  }
  const price = quote.price;

  let updatedUser;

  if (mode === "BUY") {
    const orderCost = qty * price;

    // Atomic conditional decrement: the balance check and the debit happen
    // in one operation, so a double-submit or two concurrent BUYs can't both
    // read a sufficient balance and then both deduct from it.
    updatedUser = await User.findOneAndUpdate(
      { _id: userId, balance: { $gte: orderCost } },
      { $inc: { balance: -orderCost } },
      { returnDocument: "after" }
    );
    if (!updatedUser) {
      throw makeError("Insufficient funds", 400);
    }

    const existingHolding = await Holding.findOne({ userId, name: symbol });
    if (existingHolding) {
      const totalQty = existingHolding.qty + qty;
      const newAvg =
        (existingHolding.avg * existingHolding.qty + price * qty) / totalQty;

      existingHolding.qty = totalQty;
      existingHolding.avg = newAvg;
      existingHolding.price = price;

      await existingHolding.save();
    } else {
      await Holding.create({ userId, name: symbol, qty, avg: price, price });
    }
  } else {
    // SELL: atomic conditional decrement guards the same way, so a
    // concurrent SELL of the same holding can't push quantity negative.
    const updatedHolding = await Holding.findOneAndUpdate(
      { userId, name: symbol, qty: { $gte: qty } },
      { $inc: { qty: -qty }, $set: { price } },
      { returnDocument: "after" }
    );
    if (!updatedHolding) {
      const owned = await Holding.findOne({ userId, name: symbol });
      throw makeError(owned ? "Insufficient quantity!" : "Stock not owned!", 400);
    }
    if (updatedHolding.qty === 0) {
      await Holding.deleteOne({ _id: updatedHolding._id });
    }

    const proceeds = qty * price;
    updatedUser = await User.findByIdAndUpdate(userId, { $inc: { balance: proceeds } }, { returnDocument: "after" });
  }

  const newOrder = await Order.create({ userId, name: symbol, qty, price, mode });

  return {
    message: "Order executed successfully",
    order: newOrder,
    balance: updatedUser.balance,
  };
}

module.exports = { getHoldings, getPositions, getFunds, getOrders, executeOrder };
