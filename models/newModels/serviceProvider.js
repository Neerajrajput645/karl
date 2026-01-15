const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
//================================ Service Provider Schema =============================
const serviceProvider = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: "User",
    },
    // location: {
    //   type: { type: String, enum: ["Point"], default: "Point" },
    //   coordinates: { type: [Number], required: true },
    // },
    city: {
      type: String,
      require: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    // isOnline: {
    //   type: Boolean,
    //   default: false,
    // },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "providerServices",
      },
    ],
  },
  {
    timestamps: true,
  }
);

serviceProvider.index({ location: "2dsphere" });

//===================== Export Model =====================
module.exports = model("ServiceProvider", serviceProvider);
