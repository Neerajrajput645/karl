const { Schema, model } = require("mongoose");

// Admin Wallet Schema
const adminWalletSchema = new Schema(
  {
    balance: { type: Number, min: 0, default: 0 },
    adminId: { type: Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

module.exports = model("AdminWallet", adminWalletSchema);
