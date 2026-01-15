const { Schema, model } = require("mongoose");

const ipSchema = new Schema(
  {
    name: { type: String, required: true },
    status: { type: Boolean, default: true },
    ip: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = model("Ip", ipSchema);
