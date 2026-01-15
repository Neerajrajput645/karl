const { Schema, model } = require("mongoose");

const rechargeOperatorSchema = new Schema(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
    airtel: { type: Number, default: 2 },
    vi: { type: Number, default: 2 },
    jio: { type: Number, default: 2 },
    bsnl: { type: Number, default: 2 },
  },
  { timestamps: true }
);

module.exports = model("RechargeOperator", rechargeOperatorSchema);
