const { Schema, model } = require("mongoose");

const appSetting = new Schema(
  {
    logo: { type: String, default: "" },
    version: { type: String, min: 0, default: 0.0 },
    status: { type: Boolean, default: true },
    name: { type: String, default: "Aadyapay" },
    serviceCharge: { type: Number, min: 0, default: 15 },
    isMaintenance: { type: Boolean, default: false },
    razorpay_key: { type: String, default: "" },
    customerPhone: { type: String, default: "" },
    referAmount: { type: String, default: 5 },
  },
  { timestamps: true }
);

module.exports = model("AppSetting", appSetting);
