const { Schema, model } = require("mongoose");

const primeBenefitSchema = new Schema({
  status: { type: Boolean, enum: [false, true], default: true },
  amount: { type: Number, min: 0, default: 0 },
  name: {
    type: String,
    default: "",
  },
});

module.exports = model("PrimeBenefit", primeBenefitSchema);
