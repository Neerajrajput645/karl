const { Schema, model } = require("mongoose");

const withdrawSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bankId: { type: Schema.Types.ObjectId, ref: "Bank", required: true },
    amount: { type: Number, min: 0, required: true },
    status: {
      type: String,
      enum: ["requested", "reject", "approved"],
      default: "requested",
    },
    message: { type: String },
  },
  { timestamps: true }
);

module.exports = model("Withdraw", withdrawSchema);
