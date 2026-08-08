const mongoose = require("mongoose");
const { Schema } = mongoose;

const PositionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  product: String,
  name: String,
  qty: Number,
  avg: Number,
  price: Number,
  net: String,
  day: String,
  isLoss: Boolean,
});

module.exports = mongoose.model("Position", PositionSchema, "positions");
