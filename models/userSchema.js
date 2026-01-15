const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    // Basic Details
    deviceToken: { type: String },
    email: { type: String, unique: true },
    lastName: { type: String, reuiqred: true },
    firstName: { type: String, reuiqred: true },
    phone: { type: String, reuiqred: true, unique: true },

    // Address Details
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    ipAddress: { type: String, default: "" },

    // User Details
    dob: { type: String, default: "" },
    gender: { type: String, default: "" },
    avatar: { type: String, default: "" },
    referBy: { type: String, default: "" },
    referBonus: { type: Boolean, default: false },
    referalId: { type: String, default: "" },
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    level: {
      type: Number,
      min: 0,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      default: 0,
    },

    // Service Status by User
    recharge: { type: Boolean, default: true },
    dth: { type: Boolean, default: true },
    bbps: { type: Boolean, default: true },
    googlePlay: { type: Boolean, default: true },
    shopping: { type: Boolean, default: true },
    addMoney: { type: Boolean, default: true },
    sendMoney: { type: Boolean, default: true },
    editProfile: { type: Boolean, default: true },
    doNotNotify: { type: Boolean, default: false },

    // Other
    mPin: { type: String, default: "" },
    status: { type: Boolean, default: true },
    isServiceProvider: { type: Boolean, default: false }, // newly added 
    isAgent: { type: Boolean, enum: [false, true], default: false },
    isPrime: { type: Boolean, enum: [false, true], default: false },
    isVerified: { type: Boolean, enum: [false, true], default: false },
    isMerchant: { type: Boolean, enum: [false, true], default: false },
    isFingerPrint: { type: Boolean, enum: [false, true], default: false },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
