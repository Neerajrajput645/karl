const { Schema, model } = require("mongoose");

// user and merchant wallet schema
const walletSchema = new Schema(
  {
    balance: { type: Number, min: 0, default: 0 },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Wallet", walletSchema);

// Vouchure will active after complete 2nd level
// On prime get ( 1999 goPoints, 100 primePoints, 300 pay later, 100 gift vouchure )
// Pay later will active after after 2st level

// Prime Membership Price = 1999 rs
