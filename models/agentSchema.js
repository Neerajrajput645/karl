const { Schema, model } = require("mongoose");

const agentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", unique: true },
    status: {
      type: String,
      enum: ["reject", "pending", "accept"],
      default: "pending",
    },
    reason: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = model("Agent", agentSchema);
