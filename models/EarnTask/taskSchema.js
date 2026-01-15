const { Schema, model } = require("mongoose");

const TaskSchema = new Schema(
  {
    title: { type: String, required: true }, // e.g. "Reel se paise kamaye"
    slug: { type: String, unique: true }, // e.g. "reel"
    description: { type: String },
    steps: [String], // list of instructions
    rewardAmount: { type: Number, required: true }, // ₹10, ₹20 etc.
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    formLink: { type: String },
  },
  { timestamps: true }
);

module.exports = model("TaskSchema", TaskSchema);
