const { Schema, model } = require("mongoose");

const matrixSchema = new Schema(
  {
    userId: { type: String, required: true },
    parentId: { type: String, default: "" },
    firstPosition: { type: String, default: "" },
    secondPosition: { type: String, default: "" },
    thirdPosition: { type: String, default: "" },
    fourthPosition: { type: String, default: "" },
    fifthPosition: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = model("Matrix", matrixSchema);

// Matrix is 3*10
