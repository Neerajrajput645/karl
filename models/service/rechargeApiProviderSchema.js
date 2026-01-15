const { Schema, model } = require("mongoose");

const rechargeApiProviderSchema = new Schema(
  {
    providerCode: { type: Number, reuiqred: true },
    providerName: { type: String, reuiqred: true },
    ipAddress: { type: String, default: "" },
    isTrue: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("RECHARGEAPIPROVIDER", rechargeApiProviderSchema);
