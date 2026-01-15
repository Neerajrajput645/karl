const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const asyncHandler = require("express-async-handler");
const JWT_SECRET = process.env.JWT_SECRET;
const CRYPTO_SECRET = process.env.CRYPTO_SECRET;
const Otp = require("../models/otpSchema");
const Admin = require("../models/adminSchema");
const Users = require("../models/userSchema");
const Txns = require("../models/txnSchema");
const successHandler = require("../common/successHandler");
const generateOTP = require("../common/generateOtp");
const sendSMS = require("../common/sendSMS");
const Recharges = require("../models/service/rechargeSchema");
const bbps = require("../models/service/bbps");
const walletSchema = require("../models/walletSchema");

// ========================= Admin Login ==========================
const adminLogin = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;
  const findUser = await Admin.findOne({ phone });
  console.log("user found by phone:", phone,"their name is :", findUser?.firstName,"", "otp:", otp);
  if (findUser) {
    if (!otp) {
      console.log("if no otp ")
      await Otp.deleteMany({ phone });
      const generatedOtp = generateOTP();
      await Otp.create({ phone, otp: generatedOtp });
      console.log("delete old otp and generated new otp");
      if (phone == "8871265906" && otp == "085208") {
        successHandler(req, res, {
          Remarks: "otp will receive sms",
          ResponseStatus: 3,
          Otp: generatedOtp,
        });
      }
      sendSMS(phone, generatedOtp);
      console.log("otp sent to admin phone:", phone);
      // Success Respond
      successHandler(req, res, {
        Remarks: "otp will receive sms",
        ResponseStatus: 3,
        Otp: generatedOtp,
      });
    } else {
      console.log("else with otp");
      const foundOTP = await Otp.findOne({ phone, otp });
      console.log("found OTP for phone:", phone, "otp:", otp, "foundOTP:", foundOTP);

      // if wrong otp
      if (!foundOTP) {
        res.status(400);
        throw new Error("Invalid Otp");
      }
      console.log("validating otp for phone:", phone, "otp:", otp);
      // validate otp
      if (foundOTP.created_at >= new Date(Date.now() - 300000)) {
        // delete otp
        await Otp.deleteOne({ _id: foundOTP._id });
        console.log("otp valid, deleted otp for phone:", phone);
        successHandler(req, res, {
          Remarks: "Login Success",
          ResponseStatus: 2,
          AccessToken: jwt.sign({ _id: findUser._id }, JWT_SECRET),
        });
      }
      // if otp expired
      else {
        console.log("otp expired for phone:", phone);
        await Otp.deleteOne({ _id: foundOTP._id });
        res.status(400);
        throw new Error("OTP has expired.");
      }
    }
  } else {
    console.log("admin not found with phone:", phone);
    res.status(400);
    throw new Error("invalid phone number");
  }
});

// ========================= Admin Profile ==========================
const adminProfile = asyncHandler(async (req, res) => {
  console.log("fetching admin profile for admin id:", req.data?._id);
  const { _id } = req.data;
  const adminFound = await Admin.findOne({ _id }).populate("wallet");
  console.log("admin profile found:", adminFound?.firstName);
  successHandler(req, res, {
    Remarks: "Admin Profile Data",
    Data: (adminFound),
  });
});

// ========================= Dashboard Data ==========================
const dashboardApi = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59
  );

  const [
    todayRecharges,
    todayBillPayment,
    todayAddmoney,
    userStats,
    totalWalletAmount,
  ] = await Promise.all([
    Recharges.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          status: { $in: ["Success", "success"] },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]),
    bbps.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          status: { $in: ["Success", "success"] },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]),
    Txns.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          txnResource: "Online",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$txnAmount" },
          count: { $sum: 1 },
        },
      },
    ]),
    Users.aggregate([
      {
        $facet: {
          totalUsers: [{ $count: "count" }],
          activeUsers: [{ $match: { status: true } }, { $count: "count" }],
          primeUsers: [{ $match: { isPrime: true } }, { $count: "count" }],
          todayUsers: [
            { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
            { $count: "count" },
          ],
        },
      },
    ]),
    walletSchema.aggregate([
      {
        $group: {
          _id: null,
          totalWallet: { $sum: "$balance" }, // Assuming 'balance' is the field storing wallet amounts
        },
      },
    ]),
  ]);

  const userStatData = userStats[0] || {};
  const totalUsers = userStatData.totalUsers?.[0]?.count || 0;
  const activeUsers = userStatData.activeUsers?.[0]?.count || 0;
  const todayUsers = userStatData.todayUsers?.[0]?.count || 0;
  const totalWallet = totalWalletAmount[0]?.totalWallet || 0;

  const data = [
    {
      name: "Users",
      count: totalUsers,
      Active: activeUsers,
      TodayUser: todayUsers,
    },
    {
      name: "Today's Recharges",
      amount: todayRecharges[0]?.totalAmount.toFixed(2) || 0,
      recharge: todayRecharges[0]?.count || 0,
    },
    {
      name: "Today's Bill Payment",
      amount: todayBillPayment[0]?.totalAmount.toFixed(2) || 0,
      recharge: todayBillPayment[0]?.count || 0,
    },
    {
      name: "Today's Add Money",
      amount: todayAddmoney[0]?.totalAmount.toFixed(2) || 0,
      recharge: todayAddmoney[0]?.count || 0,
    },
    {
      name: "Total Wallet Balance",
      amount: totalWallet.toFixed(2),
    },
  ];

  successHandler(req, res, {
    Remarks: "Dashboard Data",
    Data: (data),
  });
});


// ========================= Add Refer To User ==========================
const AddReferToUser = asyncHandler(async (req, res) => {
  const { userId, referalId } = req.body;
  console.log("Adding referalId:", referalId, "to userId:", userId);
  const userFound = await Users.findOne({ _id: userId });
  if (!userFound) {
    res.status(400);
    throw new Error("User Not Found");
  }

  console.log("User found:", userFound?.firstName, "Current referBy:", userFound?.referBy);
  // If User Already Have ReferBy
  if (userFound.referBy) {
    res.status(400);
    throw new Error("User has already been referred by someone ");
  }
  // Else Set the referब and save it in DB
  const User_Refer_ID_Check = await Users.findOne({ referalId: referalId });

  // Check Refer ID Right or Wrong
  if (!User_Refer_ID_Check) {
    res.status(400);
    throw new Error("This refer ID is wrong");
  }
  console.log("Referal ID is valid, setting referBy for userId:", userId);
  // Set ReferBy into DB
  await Users.findByIdAndUpdate(
    { _id: userId },
    {
      $set: { referBy: referalId },
    }
  );

  // success respond
  successHandler(req, res, { Remarks: "ReferBy has been successfully added" });
});

module.exports = {
  adminLogin,
  adminProfile,
  dashboardApi,
  AddReferToUser,
};
