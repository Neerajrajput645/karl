const { Schema, model } = require("mongoose");

const adminTxnSchema = new Schema(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "Admin" },
    recipientId: { type: Schema.Types.ObjectId },
    txnAmount: { type: Number, min: 0, required: true },
    remarks: { type: String, required: true },
    txnType: { type: String, enum: ["credit", "debit"] },
    txnId: { type: String, unique: true, required: true, sparse: true },
    txnStatus: { type: String, required: true, default: "TXN_SUCCESS" },
    txnResource: {
      type: String,
      enum: ["Wallet"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("AdminTxn", adminTxnSchema);
