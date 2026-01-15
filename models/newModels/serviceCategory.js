const mongoose = require("mongoose");

//============================== Service Category Schema ============================
const serviceCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "providerServices",
    },
  ],
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

// ============================ Export Model ================================
module.exports = mongoose.model("serviceCategory", serviceCategorySchema);
