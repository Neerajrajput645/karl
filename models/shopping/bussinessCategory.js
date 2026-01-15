const { Schema, model } = require("mongoose");

const businessCategorySchema = new Schema(
  {
    image: { type: String, required: true },
    description: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    commission: { type: Number, min: 0, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = model("BussinessCategory", businessCategorySchema);
