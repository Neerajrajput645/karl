const mongoose = require("mongoose");

const paygicTokenSchema = new mongoose.Schema({
  paygictoken: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PaygicToken", paygicTokenSchema);
