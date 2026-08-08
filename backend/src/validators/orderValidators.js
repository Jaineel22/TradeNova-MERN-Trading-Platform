const MAX_QTY = 1000000;
const MAX_PRICE = 10000000;

function validateNewOrderInput({ name, qty, price, mode } = {}) {
  if (!name || qty === undefined || price === undefined || !mode) {
    return "name, qty, price and mode are required";
  }

  if (mode !== "BUY" && mode !== "SELL") {
    return "mode must be BUY or SELL";
  }

  if (typeof qty !== "number" || !Number.isFinite(qty) || qty <= 0) {
    return "qty must be a positive number";
  }

  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
    return "price must be a positive number";
  }

  if (qty > MAX_QTY) {
    return `qty exceeds maximum allowed (${MAX_QTY})`;
  }

  if (price > MAX_PRICE) {
    return `price exceeds maximum allowed (${MAX_PRICE})`;
  }

  return null;
}

module.exports = { validateNewOrderInput };
