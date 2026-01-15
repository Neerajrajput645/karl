const { Schema, model } = require("mongoose");

const disputeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    number: { type: String, reuiqred: true },
    operator: { type: String, reuiqred: true },
    circle: { type: String, reuiqred: true },
    transactionId: { type: String, required: true, unique: true },
    status: { type: String, reuiqred: true },
    amount: { type: Number, min: 0, default: 0, reuiqred: true },
    operatorRef: { type: String, reuiqred: true },
    apiTransID: { type: String, reuiqred: true },
    receipt: { type: String, defaut: "" },
  },
  { timestamps: true }
);

module.exports = model("Dispute", disputeSchema);
