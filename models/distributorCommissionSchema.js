const { Schema, model } = require("mongoose");

// Commission rates set by admin for each distributor per service
const distributorCommissionSchema = new Schema(
  {
    distributorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceType: {
      type: String,
      enum: ["mobile", "dth", "bbps"],
      required: true,
    },
    // e.g., "Airtel", "Jio", "Electricity", "Gas", etc.
    serviceName: {
      type: String,
      required: true,
    },
    commission: {
      type: Number,
      required: true,
      min: 0,
    },
    symbol: {
      type: String,
      enum: ["%", "₹"],
      default: "%",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound index to ensure unique commission per distributor per service
distributorCommissionSchema.index(
  { distributorId: 1, serviceType: 1, serviceName: 1 },
  { unique: true }
);

module.exports = model("DistributorCommission", distributorCommissionSchema);
