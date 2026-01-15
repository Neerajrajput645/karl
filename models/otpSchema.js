const { Schema, model } = require("mongoose");

const otpSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  phone: { type: String, required: true },
  otp: { type: String, required: true },
  created_at: {
    type: Date,
    default: Date.now,
    expires: "10m", // OTP expires after 10 minutes
  },
});

module.exports = model("Otp", otpSchema);
