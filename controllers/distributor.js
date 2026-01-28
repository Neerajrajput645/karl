const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const User = require("../models/userSchema");
const Wallet = require("../models/walletSchema");
const DistributorEarnings = require("../models/distributorEarningsSchema");
const successHandler = require("../common/successHandler");
const uniqueIdGenerator = require("../common/uniqueIdGenerator");

// ======================= CREATE RETAILER =======================
const createRetailer = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const { firstName, lastName, phone, email } = req.body;

  // Verify current user is a Distributor
  const distributor = await User.findById(_id);
  if (!distributor || distributor.userType !== "Distributor") {
    res.status(403);
    throw new Error("Only distributors can create retailers");
  }

  // Check if phone already exists
  const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    res.status(400);
    throw new Error("Phone number is already registered");
  }

  // Check if email already exists
  if (email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(400);
      throw new Error("Email is already registered");
    }
  }

  // Generate unique referral ID
  let referalId = uniqueIdGenerator("referalId");
  const existingReferId = await User.findOne({ referalId });
  if (existingReferId) {
    referalId = uniqueIdGenerator("referalId");
  }

  // Create retailer
  const newRetailer = new User({
    firstName,
    lastName,
    phone: phone?.toString(),
    email,
    referalId,
    userType: "Retailer",
    createdBy: distributor._id,
  });

  await newRetailer.save();

  // Create wallet for retailer
  const newWallet = new Wallet({ userId: newRetailer._id });
  await newWallet.save();
  newRetailer.wallet = newWallet._id;
  await newRetailer.save();

  successHandler(req, res, {
    Remarks: "Retailer created successfully",
    Data: {
      _id: newRetailer._id,
      firstName: newRetailer.firstName,
      lastName: newRetailer.lastName,
      phone: newRetailer.phone,
      email: newRetailer.email,
      userType: newRetailer.userType,
    },
  });
});

// ======================= GET MY RETAILERS =======================
const getMyRetailers = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const retailers = await User.find({ createdBy: _id, userType: "Retailer" })
    .select("firstName lastName phone email status createdAt")
    .populate("wallet", "balance")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await User.countDocuments({ createdBy: _id, userType: "Retailer" });

  successHandler(req, res, {
    Remarks: "Retailers fetched successfully",
    Data: {
      retailers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

// ======================= GET MY EARNINGS =======================
const getMyEarnings = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const earnings = await DistributorEarnings.find({ distributorId: _id })
    .populate("retailerId", "firstName lastName phone")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await DistributorEarnings.countDocuments({ distributorId: _id });

  successHandler(req, res, {
    Remarks: "Earnings fetched successfully",
    Data: {
      earnings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

// ======================= GET EARNINGS SUMMARY =======================
const getEarningsSummary = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  
  // Convert _id to ObjectId for aggregate queries
  const distributorObjectId = new mongoose.Types.ObjectId(_id);

  // Get today's start and end
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

  // Get this month's start
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [totalEarnings, todayEarnings, monthEarnings, totalRetailers] = await Promise.all([
    DistributorEarnings.aggregate([
      { $match: { distributorId: distributorObjectId, status: "credited" } },
      { $group: { _id: null, total: { $sum: "$commissionAmount" }, count: { $sum: 1 } } },
    ]),
    DistributorEarnings.aggregate([
      { $match: { distributorId: distributorObjectId, status: "credited", createdAt: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: null, total: { $sum: "$commissionAmount" }, count: { $sum: 1 } } },
    ]),
    DistributorEarnings.aggregate([
      { $match: { distributorId: distributorObjectId, status: "credited", createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$commissionAmount" }, count: { $sum: 1 } } },
    ]),
    User.countDocuments({ createdBy: _id, userType: "Retailer" }),
  ]);

  successHandler(req, res, {
    Remarks: "Earnings summary fetched successfully",
    Data: {
      totalEarnings: totalEarnings[0]?.total || 0,
      totalTransactions: totalEarnings[0]?.count || 0,
      todayEarnings: todayEarnings[0]?.total || 0,
      todayTransactions: todayEarnings[0]?.count || 0,
      monthEarnings: monthEarnings[0]?.total || 0,
      monthTransactions: monthEarnings[0]?.count || 0,
      totalRetailers,
    },
  });
});

// ======================= GET COMMISSION RATES =======================
const getCommissionRates = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  
  const rates = await require("../models/distributorCommissionSchema").find({ 
    distributorId: _id,
    status: true 
  }).sort({ serviceType: 1, serviceName: 1 });

  // Group by service type
  const groupedRates = rates.reduce((acc, rate) => {
    const type = rate.serviceType || "others";
    if (!acc[type]) acc[type] = [];
    acc[type].push(rate);
    return acc;
  }, {});

  successHandler(req, res, {
    Remarks: "Commission rates fetched successfully",
    Data: groupedRates,
  });
});

module.exports = {
  createRetailer,
  getMyRetailers,
  getMyEarnings,
  getEarningsSummary,
  getCommissionRates,
};
