const { Schema, model } = require("mongoose");

const txnSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    recipientId: { type: Schema.Types.ObjectId, ref: "User" },
    txnName: { type: String, default: "" },
    gatewayName: { type: String, default: "" },

    txnDesc: { type: String, default: "" },
    txnAmount: { type: Number, min: 0, required: true },
    txnType: { type: String, enum: ["credit", "debit"] },
    txnId: { type: String, unique: true, required: true, sparse: true },
    serviceId: { type: String, default: "" },
    mid: { type: String, default: "" },
    orderId: { type: String, unique: true, required: true },
    txnStatus: {
      type: String,
      enum: ["TXN_FAILED", "TXN_SUCCESS", "TXN_PENDING"],
      required: true,
    },
    txnResource: {
      type: String,
      enum: ["Wallet", "Online"],
      required: true,
    },
    ipAddress: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = model("Txn", txnSchema);

// Wallet (add, send, receive)
