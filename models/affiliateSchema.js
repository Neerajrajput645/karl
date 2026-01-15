const { Schema, model } = require("mongoose");

// Affiliate
const affiliateSchema = new Schema(
  {
    name: { type: String, required: true },
    route: { type: String, required: true },
    icon: { type: String, required: true },
    status: { type: Boolean, default: true },
    description: { type: String, required: true },
    section:{type:String, required:true,},
    isShow:{type:Boolean,  required:true, default:true }
  },
  { timestamps: true }
);

module.exports = model("Affiliate", affiliateSchema);
