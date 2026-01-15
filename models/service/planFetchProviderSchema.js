const { Schema, model } = require("mongoose");

const planFetchProviderSchema = new Schema(
  {
    providerCode: { type: Number, reuiqred: true },
    providerName: { type: String, reuiqred: true },
    ipAddress: { type: String, default: "" },
    isTrue: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("PLANAPIPROVIDER", planFetchProviderSchema);
