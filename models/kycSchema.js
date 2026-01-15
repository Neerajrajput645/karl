const { Schema, model, SchemaType } = require("mongoose");

const userKycSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    role: { type: String, enum: ["user", "merchant"], default: "user" },
    photo: { type: String, required: true },
    aadhaarFront: { type: String, required: true },
    aadhaarBack: { type: String, required: true },
    pan: { type: String, required: true },
    otherDoc: { type: String, default: "" },
    status: { type: String, default: "" },
    reason: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = model("KYC", userKycSchema);
