const { Schema, model } = require("mongoose");

const cashfreeOrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming 'User' is the name of your User model
      required: true,
      unique: true,
    },
    amount: { type: Number, min: 0, required: true },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILURE"], // Only 'pending' or 'SUCCESS' allowed
      required: true,
    },
    orderId: { type: String, required: true },
    cashfree_order_id: { type: String, required: true },
    payment_session_id: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("CashfreeOrder", cashfreeOrderSchema);
