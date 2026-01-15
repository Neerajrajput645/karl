const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
  password: { type: String, reuiqred: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  avatar: { type: String, default: "" },
  wallet: { type: Schema.Types.ObjectId, ref: "AdminWallet" },
  role: {
    type: String,
    enum: ["SuperAdmin", "Admin", "SubAdmin"],
    required: true,
    default: "Admin",
  },
});

module.exports = model("Admin", adminSchema);
