const CRYPTO_SECRET = process.env.CRYPTO_SECRET;
const Otp = require("../models/otpSchema");
const User = require("../models/userSchema");
const CryptoJS = require("crypto-js");
const sendSMS = require("../common/sendSMS");
const generateOTP = require("../common/generateOtp");
const asyncHandler = require("express-async-handler");
const successHandler = require("../common/successHandler");

// =========================== USER CONTROLLERS =========================== //
const userProfile = asyncHandler(async (req, res) => {
  console.log("fetching user profile started");
  const { _id } = req.data;

  const userFound = await User.findById(_id).populate("wallet");
  console.log("user found:", userFound?.firstName);
  if (!userFound) {
    res.status(404);
    throw new Error("User not found");
  }
  // show only firstName, lastName, email, phone, wallet, avatar
  const { 
    password, 
    level,
    isAgent, 
    isPrime,
    isVerified,
    isMerchant,
    isFingerPrint,
    doNotNotify,
    editProfile,
    sendMoney,
    addMoney,
    shopping,
    googlePlay,
    bbps,
    dth,
    recharge,
    referBonus,
    avatar,
    gender,
    dob,
    ipAddress,
    postalCode,
    state,
    city,
    ...others } = userFound.toObject();

  // Format wallet amount: 54.2224 -> 54.2
if (others.wallet && others.wallet.balance !== undefined) {
  others.wallet.balance = Number(others.wallet.balance.toFixed(2));
}
  successHandler(req, res, {
    Data: others,
    Remarks: "User Profile Fetch Successfull.",
  });
});

// ============================ USER LIST FOR ADMIN ============================ //
const userList = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || parseInt(req.body.page) || 1;
  const limit = parseInt(req.query.limit) || parseInt(req.body.limit) || 20;
  const searchVal = req.query.search || req.body.search || "";
  const selectVal = req.query.select || req.body.select || "";
  const filter = req.query.filter || req.body.filter || "";
  const query = {};
  let sortOption = { createdAt: -1 }; // Default sorting

  // 🔍 Search Logic
  if (searchVal && selectVal) {
    if (["phone", "email", "_id"].includes(selectVal)) {
      query[selectVal] = searchVal;
    } else if (selectVal === "name") {
      query.$or = [
        { firstName: { $regex: searchVal, $options: "i" } },
        { lastName: { $regex: searchVal, $options: "i" } },
      ];
    }
  }

  // 🎯 Filter Logic
  if (filter) {
    switch (filter) {
      case "active":
        query.status = true;
        break;
      case "deactive":
        query.status = false;
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "htl":
        sortOption = { "wallet.balance": -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      default:
        break;
    }
  }

  // 📄 Fetch Users with Pagination
  let allUsers = await User.find(query)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("wallet", "balance");

  // 🔐 Decrypt MPIN Safely
  allUsers = allUsers.map((user) => {
    try {
      if (user.mPin) {
        const bytes = CryptoJS.AES.decrypt(user.mPin, CRYPTO_SECRET);
        user = user.toObject();
        user.mPin = bytes.toString(CryptoJS.enc.Utf8);
      }
    } catch (e) {
      user = user.toObject();
      user.mPin = null;
    }
    return user;
  });

  // 📊 Pagination Meta
  const total = await User.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  // ✅ Success Response with Proper Pagination
  successHandler(req, res, {
    Data: {
      data: allUsers,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    },
    Remarks: "User Profile Fetch Successful.",
  });
});


// ============================ REFER LIST ============================ //
const referList = asyncHandler(async (req, res) => {
  const { referalId } = req.data;
  const data = await User.find({ referBy: referalId }).select("firstName lastName phone email");

  // success respond
  successHandler(req, res, {
    Remarks: "Refer list",
    Data:data,
  });
});

// ============================ USER STATUS UPDATE BY ADMIN ============================ //
const statusUpdate = asyncHandler(async (req, res) => {
  const { userId, status } = req.body;

  // update user
  await User.updateOne({ _id: userId }, { $set: { status } });

  // success respond
  successHandler(req, res, { Remarks: "status update success" });
});

// ============================ USER TYPE UPDATE BY ADMIN ============================ //
const userTypeUpdate = asyncHandler(async (req, res) => {
  const { userId, userType } = req.body;

  // Validate userType
  if (!["Retailer", "Distributor"].includes(userType)) {
    res.status(400);
    throw new Error("Invalid userType. Must be 'Retailer' or 'Distributor'");
  }

  // Get the user first
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update user type
  await User.updateOne({ _id: userId }, { $set: { userType } });

  // success respond
  successHandler(req, res, { 
    Remarks: `User type updated to ${userType}`,
    Data: { userType }
  });
});


// -----------------------------------------------------------------------------------------------

// ============================ CREATE MPIN ============================ //
const createMpin = asyncHandler(async (req, res) => {
  const { mPin } = req.body;
  const { _id } = req.data;

  console.log("create mpin called", mPin, _id);
  // throw error
  if (mPin.toString().length !== 4) {
    res.status(400);
    throw new Error("mPin must be have 4 digits");
  }
  const userFound = await User.findById(_id);
  if (!userFound) {
    res.status(404);
    throw new Error("User not found");
  }
  if (userFound.mPin) {
    res.status(400);
    throw new Error("mPin already created");
  }
  // secure mpin
  const encryptMpin = CryptoJS.AES.encrypt(mPin, CRYPTO_SECRET).toString();

  // update mpin
  await userFound.updateOne({ $set: { mPin: encryptMpin } });

  // success handler
  successHandler(req, res, { Remarks: "MPIN generated successfully." });
});

// ============================ VERIFY MPIN ============================ //
const verifyMpin = asyncHandler(async (req, res) => {
  const { mPin } = req.body;
  console.log("mpin", req.body);
  console.log("header", req.headers);
  const userFound = req.data;
  // decrypt mpin
  console.log("user found", userFound.firstName);
  const decryptMpin = CryptoJS.AES.decrypt(
    userFound.mPin,
    CRYPTO_SECRET
  ).toString(CryptoJS.enc.Utf8);

  if (mPin.toString() !== decryptMpin) {
    console.log("invalid m pin")
    res.status(400);
    throw new Error("Please enter valid mPin");
  }
  console.log("m pin success");
  // success respond
  successHandler(req, res, { Remarks: "Verify mPin" });
});

// ============================ FORGOT MPIN ============================ //
const forgotMpin = asyncHandler(async (req, res) => {
  const userFound = req.data;
  const generatedOtp = generateOTP();

  await Otp.create({ phone: userFound.phone, otp: generatedOtp });

  // send otp to mobile
  sendSMS(userFound.phone, generatedOtp);

  //  success handle
  successHandler(req, res, { Remarks: "Otp sent on your email or phone." });
});

// =============================== VERIFY OTP ============================ //
const verifyOTP = asyncHandler(async (req, res) => {
  const { otp, newMpin } = req.body;
  const { phone, _id } = req.data;
  const foundOTP = await Otp.findOne({ phone, otp });

  // if invalid otp not found
  if (!foundOTP) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  // throw error
  if (newMpin.toString().length !== 4) {
    res.status(400);
    throw new Error("mPin must be have 4 digits");
  }

  // secure mpin
  const encryptMpin = CryptoJS.AES.encrypt(
    newMpin.toString(),
    CRYPTO_SECRET
  ).toString();

  // update mpin
  await User.findByIdAndUpdate(_id, { $set: { mPin: encryptMpin } });
  await Otp.deleteOne({ _id: foundOTP._id });

  // success handler
  successHandler(req, res, { Remarks: "Updated mPin" });
});

// ============================ UPDATE MPIN ============================ //
const updateMpin = asyncHandler(async (req, res) => {
  const { oldMpin, newMpin } = req.body;
  const { _id, mPin } = req.data;

  // decrypt mpin
  const decryptMpin = CryptoJS.AES.decrypt(mPin, CRYPTO_SECRET).toString(
    CryptoJS.enc.Utf8
  );

  if (newMpin.toString().length === 4 && oldMpin.toString() === decryptMpin) {
    // secure mpin
    const encryptMpin = CryptoJS.AES.encrypt(
      newMpin.toString(),
      CRYPTO_SECRET
    ).toString();

    await User.findByIdAndUpdate(_id, {
      $set: { mPin: encryptMpin },
    });

    // success response
    successHandler(req, res, { Remarks: "Updated mPin" });
  } else {
    res.status(400);
    throw new Error(
      parseInt(oldMpin) === mPin
        ? "mPin must be have 4 digits"
        : "wrong old mPin"
    );
  }
});


module.exports = {
  userProfile,
  referList,
  userList,
  statusUpdate,
  userTypeUpdate,
  createMpin,
  verifyMpin,
  forgotMpin,
  verifyOTP,
  updateMpin,
};
