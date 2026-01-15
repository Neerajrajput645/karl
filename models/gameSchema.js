const { Schema, model } = require("mongoose");

const gameSchema = new Schema(
  {
    link: { type: String, required: true },
    image: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("Game", gameSchema);
