const { model, Schema } = require("mongoose");

// ================================ Provider Review Schema ===================================
const providerServices = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
// ================================ Export Model ===================================
module.exports = model("providerServices", providerServices);
