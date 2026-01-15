const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
  {
    body: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String },
    imageNotification:{type:Boolean, default:true},
    byAdmin: { type: Boolean, required: true, default: false },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    recipient: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Notification", notificationSchema);
