const { Schema, model } = require("mongoose");

const onegatewayOrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming 'User' is the name of your User model
      required: true,
    },
    amount: { type: Number, min: 0, required: true },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILURE"], // Only 'pending' or 'SUCCESS' allowed
      required: true,
    },
    orderId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("OnegatewayeOrder", onegatewayOrderSchema);
