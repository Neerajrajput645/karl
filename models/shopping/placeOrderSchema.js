const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const placeOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, min: 0, required: true },
    size: { type: String },
    color: { type: String },
    totalPrice: { type: Number, min: 0, required: true },
    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "Shipping",
      required: true,
    },
    paymentMethod: { type: String, required: true },
    txnId: { type: String, required: true },
    orderDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date },
    actionBy: { type: String },
    status: {
      type: String,
      enum: [
        "order placed",
        "order confirmed",
        "canceled requested",
        "canceled",
        "rejected",
        "shipped",
        "out for delivery",
        "delivered",
      ],
      default: "order placed",
    },
    reason: { type: String },
    shipRocketRes: {
      order_id: { type: Number },
      shipment_id: { type: Number },
      status: { type: String },
      status_code: { type: Number },
      onboarding_completed_now: { type: Number, min: 0, default: 0 },
      awb_code: { type: String, default: null },
      courier_company_id: { type: String, default: null },
      courier_name: { type: String, default: null },
    },
  },
  { timestamps: true }
);

const PlaceOrder = mongoose.model("PlaceOrder", placeOrderSchema);

module.exports = PlaceOrder;
