mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["PENDING", "RESOLVED", "REJECTED"], default: "PENDING" },
},{
    timestamps: true,
});

module.exports = mongoose.model("Complaint", complaintSchema);
