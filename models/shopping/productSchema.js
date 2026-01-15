const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    merchantId: { type: Schema.Types.ObjectId, ref: "User" },
    subcategoryId: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    productName: { type: String, required: true },
    productDesc: { type: String, required: true },
    productImage: { type: Array, default: [] },
    productActualPrice: { type: String, required: true },
    productSalePrice: { type: String },
    isPublish: { type: Boolean, default: false },
    stock: { type: Number, min: 0, required: true },
    tags: { type: Array, default: [] },
    size: { type: Array, default: [] },
    color: { type: Array, default: [] },
    afterCommission: { type: Boolean, default: false },
    dimension: {
      height: { type: Number, min: 0, default: 0, required: true },
      weight: { type: Number, min: 0, default: 0, required: true },
      length: { type: Number, min: 0, default: 0, required: true },
      breadth: { type: Number, min: 0, default: 0, required: true },
    },
  },
  { timestamps: true }
);

module.exports = model("Product", productSchema);
