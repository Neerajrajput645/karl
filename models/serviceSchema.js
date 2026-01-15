const { Schema, model } = require("mongoose");

const serviceSchema = new Schema(
  {
    percent: { type: Number, min: 0, default: 0 },
    icon: { type: String, required: true },
    isCoupon: { type: Boolean, default: false },
    name: { type: String, required: true, unique: true },
    status: { type: Boolean, required: true, default: true },
    isShow: { type: Boolean, required: true, default: true },
    type: {
      type: String,
      enum: ["Discount", "Cashback", "GCB"],
      required: true,
    },
    route: { type: String, default: "" },
    section: {
      type: String,
      enum: ["finance", "travel", "recharge", "loan", "insurance", ""],
    },
  },
  { timestamps: true }
);

module.exports = model("Service", serviceSchema);
