const { Schema, model } = require("mongoose");

const serviceAreaSchema = new Schema(
  {
    pinCode: { type: String, required: true },
    status: { type: Boolean, default: true },
    deliveryCharge: { type: String, default: 0 },
  },
  { timestamps: true }
);

module.exports = model("ServiceArea", serviceAreaSchema);
