const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  name: String,
  qty: Number,
  price: Number,
  mode: String,
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema, "orders");
