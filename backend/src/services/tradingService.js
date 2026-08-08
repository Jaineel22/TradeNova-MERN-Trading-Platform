const Holding = require("../models/Holding");
const Order = require("../models/Order");
const Position = require("../models/Position");
const User = require("../models/User");
const { validateNewOrderInput } = require("../validators/orderValidators");

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

async function executeOrder(userId, { name, qty, price, mode }) {
  const validationError = validateNewOrderInput({ name, qty, price, mode });
  if (validationError) {
    throw makeError(validationError, 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw makeError("User not found", 404);
  }

  let existingHolding = await Holding.findOne({ userId, name });
  let updatedBalance = user.balance;

  if (mode === "BUY") {
    const orderCost = qty * price;

    if (user.balance < orderCost) {
      throw makeError("Insufficient funds", 400);
    }

    updatedBalance = user.balance - orderCost;

    if (existingHolding) {
      const totalQty = existingHolding.qty + qty;
      const newAvg =
        (existingHolding.avg * existingHolding.qty + price * qty) / totalQty;

      existingHolding.qty = totalQty;
      existingHolding.avg = newAvg;
      existingHolding.price = price;

      await existingHolding.save();
    } else {
      const newHolding = new Holding({
        userId,
        name,
        qty,
        avg: price,
        price,
      });
      await newHolding.save();
    }
  }

  if (mode === "SELL") {
    if (!existingHolding) {
      throw makeError("Stock not owned!", 400);
    }

    if (existingHolding.qty < qty) {
      throw makeError("Insufficient quantity!", 400);
    }

    existingHolding.qty -= qty;
    existingHolding.price = price;

    if (existingHolding.qty === 0) {
      await Holding.deleteOne({ userId, name });
    } else {
      await existingHolding.save();
    }

    const proceeds = qty * price;
    updatedBalance = user.balance + proceeds;
  }

  const newOrder = new Order({ userId, name, qty, price, mode });
  await newOrder.save();

  user.balance = updatedBalance;
  await user.save();

  return {
    message: "Order executed successfully",
    order: newOrder,
    balance: user.balance,
  };
}

module.exports = { getHoldings, getPositions, getFunds, executeOrder };
