const { Schema, model } = require("mongoose");

const paygicOrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, min: 0, required: true },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILURE"], // Only 'pending' or 'SUCCESS' allowed
      required: true,
    },
    merchantReferenceId: { type: String, required: true },
    paygicReferenceId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("PaygicOrder", paygicOrderSchema);
