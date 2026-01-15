const { Schema, model } = require("mongoose");

const razorpaySchema = new Schema(
  {
    status: { type: Boolean, default: false },
    razorpay_order_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("Razorpay", razorpaySchema);
