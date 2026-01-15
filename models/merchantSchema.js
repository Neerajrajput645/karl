const { Schema, model } = require("mongoose");

const merchantSchema = new Schema(
  {
    about: { type: String },
    businessTimeTo: { type: String },
    businessTimeFrom: { type: String },
    // gstinNum: { type: String, default: "" },
    panNumber: { type: String, required: true },
    businessName: { type: String, required: true },
    waNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", unique: true },
    category: { type: Schema.Types.ObjectId, ref: "BussinessCategory" },

    // store information
    mid: { type: String, unique: true },
    city: { type: String, required: true },
    image: { type: String, required: true },
    state: { type: String, required: true },
    commission: { type: Number, min: 0, default: 0 },
    postalCode: { type: String, required: true },
    storeAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ["reject", "pending", "accept"],
      default: "pending",
    },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
  },
  { timestamps: true }
);

merchantSchema.index({ location: "2dsphere" });

module.exports = model("Merchant", merchantSchema);
