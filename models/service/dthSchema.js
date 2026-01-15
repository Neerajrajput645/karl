const { Schema, model } = require("mongoose");

const dthSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    number: { type: String, required: true },
    operator: { type: String, required: true },
    transactionId: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    amount: { type: Number, min: 0, default: 0, required: true },
    operatorRef: { type: String, required: true },
    apiTransID: { type: String, required: true },
    receipt: { type: String, defaut: "" },
    ipAddress: {
      type: String,
      default: "",
    },
    provider: { type: String, default: "" },
    lastCheckedAt: { type: Date, default: null },

  },
  { timestamps: true }
);

module.exports = model("DTH", dthSchema);
