const { Schema, model } = require("mongoose");
const faqSchema = new Schema(
    {
        question: { type: String, required: false },
        answer: { type: String, required: false },
        status: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = model("FAQ", faqSchema);
