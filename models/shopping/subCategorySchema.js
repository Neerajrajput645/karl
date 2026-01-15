const { Schema, model } = require("mongoose");

const subCategorySchema = new Schema(
  {
    image: { type: String, required: true },
    description: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

module.exports = model("SubCategory", subCategorySchema);
