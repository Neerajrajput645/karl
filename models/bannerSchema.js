const { Schema, model } = require("mongoose");

const bannerSchema = new Schema(
  {
    type: { type: String},
    link: { type: String, required: true },
    image: { type: String, required: true },
    section: {
      type: String,
      required: true,
      enum: ["service", "game", "shopping", "wallet", "recharge", "bill", "bottom"],
    },
  },
  { timestamps: true }
);

module.exports = model("Banner", bannerSchema);
