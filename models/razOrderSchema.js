const { Schema, model } = require("mongoose");

const razorpayOrderSchema = new Schema(
  {
    amount: { type: Number, min: 0, required: true },
    status: { type: Boolean, default: false },
    razorpay_order_id: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("RazorpayOrder", razorpayOrderSchema);
