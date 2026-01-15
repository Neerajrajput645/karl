const { Schema, model } = require("mongoose");

const bbpsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    number: { type: String, reuiqred: true },
    operator: { type: String, reuiqred: true },
    operatorName:{type:String},
    username:{type:String},
    circle: { type: String, reuiqred: true },
    serviceId: { type: String, reuiqred: true },
    transactionId: { type: String, required: true, unique: true },
    status: { type: String, reuiqred: true },
    amount: { type: Number, min: 0, default: 0, reuiqred: true },
    operatorRef: { type: String, reuiqred: true },
    apiTransID: { type: String, reuiqred: true },
    receipt: { type: String, defaut: "" },
    ipAddress: {
      type: String,
      default: "",
    },
    rawResponse: { type: Object },
    lastCheckedAt: { type: Date, default: null },

  },
  { timestamps: true }
);

module.exports = model("BBPS", bbpsSchema);
