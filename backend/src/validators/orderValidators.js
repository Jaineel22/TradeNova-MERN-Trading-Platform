const MAX_QTY = 1000000;

// Execution price is no longer accepted from the client - it is looked up
// server-side from the live quote at execution time, so a client can't place
// an order at a fabricated price. See tradingService.executeOrder.
function validateNewOrderInput({ name, qty, mode } = {}) {
  if (!name || qty === undefined || !mode) {
    return "name, qty and mode are required";
  }

  if (typeof name !== "string" || !name.trim()) {
    return "name must be a non-empty string";
  }

  if (mode !== "BUY" && mode !== "SELL") {
    return "mode must be BUY or SELL";
  }

  if (typeof qty !== "number" || !Number.isFinite(qty) || qty <= 0) {
    return "qty must be a positive number";
  }

  if (!Number.isInteger(qty)) {
    return "qty must be a whole number of shares";
  }

  if (qty > MAX_QTY) {
    return `qty exceeds maximum allowed (${MAX_QTY})`;
  }

  return null;
}

module.exports = { validateNewOrderInput };
