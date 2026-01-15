const { Schema, model } = require("mongoose");

const paymentGatewaySchema = new Schema(
  {
    paymentGatewayName: { type: String, reuiqred: true },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("PaymentGateway", paymentGatewaySchema);
