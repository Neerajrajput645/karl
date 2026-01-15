const { Schema, model, SchemaType } = require("mongoose");

const newUserKycFunc = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    zipurl: { type: String, required: true },
    sharecode: { type: String, required: true },
    aadhaarNo: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("newKYC", newUserKycFunc);
