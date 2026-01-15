const { Schema, model } = require("mongoose");

const fingerSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    isFingerPrint: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("Finger", fingerSchema);
