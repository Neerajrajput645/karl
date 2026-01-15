const { Schema, model } = require("mongoose");
const UserTaskSubmissionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: "TaskSchema",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  rewardCredited: { type: Boolean, default: false },
  remarks: { type: String }, // admin remarks
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
});

module.exports = model("UserTaskSubmissionSchema", UserTaskSubmissionSchema);
