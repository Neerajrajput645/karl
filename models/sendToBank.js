const { Schema, model } = require("mongoose");
const sendToBankSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  amount: {
    type: Number,
    require: true,
    default: 0,
  },
  status: {
    type: String,
    require: true,
    default: "PENDING",
    enum: ["PENDING", "ACCEPT", "DECLINE"],
  },
});

module.exports = model("sendToBank", sendToBankSchema);
