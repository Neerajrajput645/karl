const asyncHandler = require("express-async-handler");
const User = require("../models/userSchema");
const Wallet = require("../models/walletSchema");
const DistributorCommission = require("../models/distributorCommissionSchema");
const DistributorEarnings = require("../models/distributorEarningsSchema");
const successHandler = require("../common/successHandler");
const uniqueIdGenerator = require("../common/uniqueIdGenerator");

// ======================= CREATE DISTRIBUTOR =======================
const createDistributor = asyncHandler(async (req, res) => {
  const { userId, firstName, lastName, phone, email } = req.body;

  // If userId provided, convert existing user to distributor
  if (userId) {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      res.status(404);
      throw new Error("User not found");
    }

    if (existingUser.userType === "Distributor") {
      res.status(400);
      throw new Error("User is already a distributor");
    }

    if (existingUser.userType === "Retailer") {
      res.status(400);
      throw new Error("Cannot convert retailer to distributor");
    }

    existingUser.userType = "Distributor";
    await existingUser.save();

    return successHandler(req, res, {
      Remarks: "User converted to distributor successfully",
      Data: {
        _id: existingUser._id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        phone: existingUser.phone,
        userType: existingUser.userType,
      },
    });
  }

  // Create new distributor
  if (!phone) {
    res.status(400);
    throw new Error("Phone number is required");
  }

  const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    res.status(400);
    throw new Error("Phone number is already registered");
  }

  if (email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(400);
      throw new Error("Email is already registered");
    }
  }

  let referalId = uniqueIdGenerator("referalId");
  const existingReferId = await User.findOne({ referalId });
  if (existingReferId) {
    referalId = uniqueIdGenerator("referalId");
  }

  const newDistributor = new User({
    firstName,
    lastName,
    phone: phone?.toString(),
    email,
    referalId,
    userType: "Distributor",
  });

  await newDistributor.save();

  const newWallet = new Wallet({ userId: newDistributor._id });
  await newWallet.save();
  newDistributor.wallet = newWallet._id;
  await newDistributor.save();

  successHandler(req, res, {
    Remarks: "Distributor created successfully",
    Data: {
      _id: newDistributor._id,
      firstName: newDistributor.firstName,
      lastName: newDistributor.lastName,
      phone: newDistributor.phone,
      email: newDistributor.email,
      userType: newDistributor.userType,
    },
  });
});

// ======================= GET ALL DISTRIBUTORS =======================
const getAllDistributors = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || "";

  const query = { userType: "Distributor" };
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const distributors = await User.find(query)
    .select("firstName lastName phone email status createdAt")
    .populate("wallet", "balance")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  // Add retailer count for each distributor
  for (let dist of distributors) {
    dist.retailerCount = await User.countDocuments({ createdBy: dist._id, userType: "Retailer" });
  }

  const total = await User.countDocuments(query);

  successHandler(req, res, {
    Remarks: "Distributors fetched successfully",
    Data: {
      distributors,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

// ======================= SET DISTRIBUTOR COMMISSION =======================
const setDistributorCommission = asyncHandler(async (req, res) => {
  const { distributorId, serviceType, serviceName, commission, symbol } = req.body;

  if (!distributorId || !serviceType || !serviceName || commission === undefined) {
    res.status(400);
    throw new Error("distributorId, serviceType, serviceName, and commission are required");
  }

  const distributor = await User.findById(distributorId);
  if (!distributor || distributor.userType !== "Distributor") {
    res.status(404);
    throw new Error("Distributor not found");
  }

  // Upsert - update if exists, create if not
  const updated = await DistributorCommission.findOneAndUpdate(
    { distributorId, serviceType, serviceName },
    {
      distributorId,
      serviceType,
      serviceName,
      commission,
      symbol: symbol || "%",
      status: true,
    },
    { upsert: true, new: true }
  );

  successHandler(req, res, {
    Remarks: "Commission set successfully",
    Data: updated,
  });
});

// ======================= GET DISTRIBUTOR COMMISSIONS =======================
const getDistributorCommissions = asyncHandler(async (req, res) => {
  const { distributorId } = req.params;

  const commissions = await DistributorCommission.find({ distributorId })
    .sort({ serviceType: 1, serviceName: 1 });

  // Group by service type
  const grouped = {
    mobile: [],
    dth: [],
    bbps: [],
  };

  commissions.forEach((c) => {
    if (grouped[c.serviceType]) {
      grouped[c.serviceType].push({
        _id: c._id,
        serviceName: c.serviceName,
        commission: c.commission,
        symbol: c.symbol,
        status: c.status,
      });
    }
  });

  successHandler(req, res, {
    Remarks: "Commissions fetched successfully",
    Data: grouped,
  });
});

// ======================= GET DISTRIBUTOR EARNINGS (ADMIN VIEW) =======================
const getDistributorEarnings = asyncHandler(async (req, res) => {
  const { distributorId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const earnings = await DistributorEarnings.find({ distributorId })
    .populate("retailerId", "firstName lastName phone")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await DistributorEarnings.countDocuments({ distributorId });

  // Calculate totals
  const totals = await DistributorEarnings.aggregate([
    { $match: { distributorId: require("mongoose").Types.ObjectId(distributorId), status: "credited" } },
    { $group: { _id: null, total: { $sum: "$commissionAmount" }, count: { $sum: 1 } } },
  ]);

  successHandler(req, res, {
    Remarks: "Earnings fetched successfully",
    Data: {
      earnings,
      summary: {
        totalEarnings: totals[0]?.total || 0,
        totalTransactions: totals[0]?.count || 0,
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

// ======================= DELETE DISTRIBUTOR COMMISSION =======================
const deleteDistributorCommission = asyncHandler(async (req, res) => {
  const { commissionId } = req.params;

  const deleted = await DistributorCommission.findByIdAndDelete(commissionId);
  if (!deleted) {
    res.status(404);
    throw new Error("Commission not found");
  }

  successHandler(req, res, {
    Remarks: "Commission deleted successfully",
    Data: deleted,
  });
});

module.exports = {
  createDistributor,
  getAllDistributors,
  setDistributorCommission,
  getDistributorCommissions,
  getDistributorEarnings,
  deleteDistributorCommission,
};
