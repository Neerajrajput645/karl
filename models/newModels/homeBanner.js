const mongoose = require("mongoose");

const homeBannerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    link: { type: String, default: "" },
    image: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeBanner", homeBannerSchema);
