const { Schema, model } = require("mongoose");

const ratingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      sparse: true,
    },
    productImages: { type: Array, default: [] },
    rating: {
      type: Number,
      min: 0,
      required: true,
      min: 1,
      max: 5,
      default: 0,
    },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("Rating", ratingSchema);
