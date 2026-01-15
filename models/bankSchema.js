const { Schema, model } = require("mongoose");

const bankSchema = new Schema(
  {
    ifsc: { type: String, required: true },
    bankName: { type: String, required: true },
    holderName: { type: String, required: true },
    branchName: { type: String, required: true },
    accountNo: { type: Number, min: 0, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Bank", bankSchema);
