const { Schema, model } = require("mongoose");

const giftCardSchema = new Schema(
  {
    redeem: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, min: 0, default: 0, required: true },
    code: { type: String, required: true, unique: true },
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = model("GiftCard", giftCardSchema);
