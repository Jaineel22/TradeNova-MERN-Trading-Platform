const mongoose = require("mongoose");
const { Schema } = mongoose;

const HoldingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  name: String,
  qty: Number,
  avg: Number,
  price: Number,
  net: String,
  day: String,
});

module.exports = mongoose.model("Holding", HoldingSchema, "holdings");
