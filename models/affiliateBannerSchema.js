const { Schema, model } = require("mongoose");

const AffiliateBannerSchema = new Schema(
  {
    type: { type: String, required: true },
    link: { type: String, required: true },
    image: { type: String, required: true },
    section: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("AffiliateBanner", AffiliateBannerSchema);
