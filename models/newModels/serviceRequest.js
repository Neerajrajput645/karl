const { Schema, model } = require("mongoose");

// ======================== service request schema ==============================
const serviceRequestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note: {
      type: String,
    },
    city: {
      type: String,
      require: true,
    },
    // location: {
    //   type: { type: String, enum: ["Point"], default: "Point" },
    //   coordinates: { type: [Number], required: true },
    // },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pinCode: { type: Number },
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "providerServices",
      required: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceProvider",
      default: null,
    },
    notifiedProviders: [String],
    cancelReason: {
      type: String,
    },
    providerMobile: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["PENDING", "PROGRESS", "COMPLETED", "CANCELED", "EXPIRED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

// indexing for optimal searching
serviceRequestSchema.index({ location: "2dsphere" });

const ServiceRequest = model("ServiceRequest", serviceRequestSchema);

// ======================== service request schema ==============================
module.exports = ServiceRequest;
