const { Schema, model } = require("mongoose");
const termConditionSchema = new Schema(
    {
        title: { type: String, required: false },
        content: { type: String, required: false },
        status: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }
);

module.exports = model("termCondition", termConditionSchema);
