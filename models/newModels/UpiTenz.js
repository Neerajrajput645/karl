const mongoose = require("mongoose");
const UpiTenzSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },

    upiOrderId: {
      type: String,
      default: null,   // UPITranzact se milega (utz_xxx)
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAIL"],
      default: "PENDING",
    },

    utr: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UpiTenz", UpiTenzSchema);