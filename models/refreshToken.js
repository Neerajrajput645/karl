const { Schema, model } = require("mongoose");

const RefreshTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 5 * 86400 }, // 5 days
});

module.exports = model("RefreshToken", RefreshTokenSchema);
