const { Schema, model } = require("mongoose");

const shippingSchema = new Schema({
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  area: { type: String, required: true },
  houseNo: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  alternatePhone: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  addressType: { type: String, enum: ["home", "work"], required: true },
});

module.exports = model("Shipping", shippingSchema);
