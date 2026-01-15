const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    operatorType: {
      type: String,
      enum: ["mobile", "dth", "bbps"],
      required: true,
    },
    commission: {
      type: Number,
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    symbol:{
      type: String,
      enum: ["%", "₹"]
    },
    status: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Commission", commissionSchema);
