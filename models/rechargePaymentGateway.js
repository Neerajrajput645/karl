const { Schema, model } = require("mongoose");

const rechargePaymentGatewaySchema = new Schema(
  {
    paymentGatewayName: { type: String, reuiqred: true },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("RechargePaymentGateway", rechargePaymentGatewaySchema);
