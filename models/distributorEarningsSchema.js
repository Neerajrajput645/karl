const { Schema, model } = require("mongoose");

// Track individual commission earnings for distributor dashboard
const distributorEarningsSchema = new Schema(
  {
    distributorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    retailerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      enum: ["mobile", "dth", "bbps"],
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    transactionAmount: {
      type: Number,
      required: true,
    },
    commissionAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "credited", "failed"],
      default: "credited",
    },
  },
  { timestamps: true }
);

// Index for faster queries on distributor dashboard
distributorEarningsSchema.index({ distributorId: 1, createdAt: -1 });
distributorEarningsSchema.index({ retailerId: 1 });

module.exports = model("DistributorEarnings", distributorEarningsSchema);
