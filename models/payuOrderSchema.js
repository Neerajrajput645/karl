const { Schema, model } = require("mongoose");

const payuOrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming 'User' is the name of your User model
      required: true,
    },
    amount: { type: Number, min: 0, required: true },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILURE"], // Only 'pending' or 'SUCCESS' 
      required: true,
    },
    payu_txn_id: { type: String, required: true },
    payu_hash: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("payuOrderSchema", payuOrderSchema);
