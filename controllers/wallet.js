const Txn = require("../models/txnSchema");
const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");
const Wallet = require("../models/walletSchema");
const Service = require("../models/serviceSchema");
const Merchant = require("../models/merchantSchema");
const Commission = require("../models/newModels/commission");
const getIpAddress = require("../common/getIpAddress");
const AdminTxn = require("../models/adminTxnSchema");
const asyncHandler = require("express-async-handler");
const successHandler = require("../common/successHandler");
const validMongooseId = require("../common/new/mongoIDvalidation");
const Notification = require("../models/notificationSchema");
const sendNotification = require("../common/sendNotification/index");

// ===================== Get Wallet Transactions =====================
const getWalletTxn = asyncHandler(async (req, res) => {
  // Extract pagination + sorting
  // console.log("req.query", req.query);
  let { page = 1, limit = 10, sort = "-createdAt" } = req.query;
  page = Number(page);
  limit = Number(limit);

  // Build dynamic filters
  const condition = { ...req.query };
  delete condition.page;
  delete condition.limit;
  delete condition.sort;

  condition.txnResource = "Wallet";

  // Get wallet info if userId exists
  let wallet = null;
  if (req.query?.userId) {
    wallet = await Wallet.findOne({ userId: req.query.userId });
  }

  // MongoDB query with pagination
  const skip = (page - 1) * limit;

  const txn = await Txn.find(condition).populate("userId")
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate("userId", "firstName lastName phone")
    ;

  // Total count for pagination
  const totalCount = await Txn.countDocuments(condition);

  successHandler(req, res, {
    Remarks: "Fetch wallet txn",
    Data: {
      wallet,
      txn,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    },
  });
});

// ===================== Check User Existence =====================
const userCheck = asyncHandler(async (req, res) => {
  const { receiverWallet } = req.body;

  const receiverUserFound =
    receiverWallet.length > 10
      ? await Merchant.findOne({ mid: receiverWallet })
      : await User.findOne({ phone: receiverWallet });

  if (receiverUserFound) {
    // successHandler
    successHandler(req, res, {
      Remarks: "Fetch user",
      Data: receiverUserFound,
    });
  } else {
    res.status(400);
    throw new Error(
      receiverWallet.length > 10 ? "invalid qr code" : "Invalid user"
    );
  }
});

// ===================== Get All User Wallets =====================
const userWallet = asyncHandler(async (req, res) => {
  let payload = { ...req.query };

  // (Optional) Convert userId to ObjectId if present
  if (payload.userId) {
    payload.userId = payload.userId.trim();
  }

  // Prevent unsafe mongo operators
  Object.keys(payload).forEach(key => {
    if (key.startsWith("$")) delete payload[key];
  });

  const wallet = await Wallet.find(payload).populate("userId");

  return successHandler(req, res, {
    Remarks: wallet && wallet.length > 0 ? "All user wallet data" : "No wallet data found",
    Data: wallet ?? []
  });
});

// ===================== Cashback Calculation =====================
const cashback = asyncHandler(async (req, res) => {
  let { serviceId, amount, opName } = req.body;

  console.log("[REQUEST] Cashback request received with serviceId:", serviceId, "amount:", amount, "opName:", opName);

  // ✅ Basic Validation
  if (!serviceId) {
    res.status(400);
    throw new Error("Service ID is required");
  }

  if (!amount || isNaN(amount) || amount <= 0) {
    res.status(400);
    throw new Error("Valid recharge amount is required");
  }

  // ✅ Fetch Service
  const service = await Service.findById(serviceId);
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  console.log("[STEP-2] Service found:", service._id);

  // ✅ Normalize Operator Name
  if (opName === "Reliance Jio Infocomm Limited") opName = "JIO";
  if (opName === "BSNL GSM") opName = "BSNL";
  if (opName === "VODAFONE") opName = "VI";

  console.log("[STEP-2.1] Normalized operator name:", opName);

  // ✅ Find Commission by Operator
  let commission = await Commission.findOne({
    serviceId,
    status: true,
    name: new RegExp(`^${opName}$`, "i"),
  });

  // ✅ Fallback: Lowest Commission If Operator Not Found
  if (!commission) {
    console.log("[STEP-3.1] Commission not found for operator:", opName);

    commission = await Commission.findOne({
      serviceId,
      status: true,
    }).sort({ commission: 1 });

    if (!commission) {
      res.status(404);
      throw new Error(`No valid commission found for serviceId: ${serviceId}`);
    }

    console.log("[STEP-3.2] Fallback commission used:", commission.commission);
  }

  console.log("[STEP-4] Commission found:", commission.commission, commission.symbol);

  // ✅ STEP-6: Cashback Calculation Based on Symbol
  let cashbackAmount = 0;

  if (commission.symbol === "%") {
    // Percentage based cashback
    cashbackAmount = (commission.commission / 100) * amount;
    cashbackAmount = parseFloat(cashbackAmount.toFixed(2));
    console.log("[STEP-6] Percentage based cashback calculated:", cashbackAmount);
  }
  else if (commission.symbol === "₹") {
    // Flat cashback
    cashbackAmount = parseFloat(commission.commission.toFixed(2));
    console.log("[STEP-6] Flat cashback applied:", cashbackAmount);
  }
  else {
    cashbackAmount = 0;
    console.log("[STEP-6] Invalid commission symbol, cashback set to 0");
  }

  // ✅ Final Success Response
  successHandler(req, res, {
    Remarks: "Cashback amount fetched successfully",
    data: {
      Cashback: cashbackAmount,
      type: "cashback",
      category: commission.operatorType,
      unit: "₹",
      symbol: commission.symbol,
    }
  });
});


// ===================== Get Wallet By User =====================
const getWalletByUser = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const data = await Wallet.findOne({ userId: _id });
  if (data) {
    data.balance = parseFloat(data.balance).toFixed(2);
  }
  successHandler(req, res, { Remarks: "Fetch wallet by user", Data: data });
});

// ===================== Manage User Wallet Money (Admin) =====================
const manageUserWalletMoney = asyncHandler(async (req, res) => {
  // Implementation here
  console.log("req.query", req.query); // empty
  console.log("req.body", req.body);
  console.log("req.header", req.header);
  const { _id } = req.data;
  console.log("admin id", _id);
  const service = await Service.findOne({ name: "ADD_MONEY" });
  if (!service.status) {
    res.status(400);
    throw new Error("This service currently block");
  }
  console.log("admin id", _id)
  const adminWallet = await Admin.findById(_id);
  // if(!adminWallet){
  //   res.status(400);
  //   throw new Error("Admin wallet not found");
  // }
  // if(!adminWallet.status || !adminWallet.userId.status){
  //   res.status(400);
  //   throw new Error("Admin wallet is inactive");
  // }
  // if(adminWallet.balance < req.body.amount || adminWallet.balance <=0){
  //   res.status(400);
  //   throw new Error("Insufficient admin wallet balance");
  // }

  // console.log("Admin Wallet:", adminWallet);
  const { userId, amount, type } = req.body;
  const txnAmount = Number(amount);

  if (!["credit", "debit"].includes(type)) {
    res.status(400);
    throw new Error("Invalid type, must be credit or debit");
  }

  if (!userId || !txnAmount || txnAmount <= 0) {
    console.log("Invalid userId or amount:", { userId, amount });
    res.status(400);
    throw new Error("Please provide valid userId and amount");
  }

  if (Number(amount) > 5000) {
    res.status(400);
    throw new Error("Maximum ₹5000 allowed per transaction");
  }
  // Validate userId
  validMongooseId(res, userId);
  const userWallet = await Wallet.findOne({ userId: userId }).populate('userId');
  if (!userWallet) {
    res.status(400);
    throw new Error("User wallet not found");
  }
  if (!userWallet.userId.status) {
    console.log("User wallet or user is inactive", userWallet.userId.status);
    res.status(400);
    throw new Error("User wallet is inactive");
  }
  // Debit admin wallet

  if (type === "credit") {

    const user = await User.findById(userId);
    userWallet.balance += txnAmount;
    await userWallet.save();

    // adminWallet.wallet.balance -= txnAmount;
    // await adminWallet.wallet.save();
    const adminNewTxn = new AdminTxn({
      adminId: adminWallet._id,
      recipientId: userId,
      txnAmount: txnAmount,
      remarks: `Admin credited ₹${txnAmount} to user wallet`,
      txnType: "debit",
      txnId: Math.floor(Math.random() * Date.now()) + "adminCredit",
      txnStatus: "TXN_SUCCESS",
      txnResource: "Wallet",
    });
    await adminNewTxn.save();



    const userNewTxn = new Txn({
      userId: userId,
      recipientId: userId,
      txnName: "Amount Credited",
      txnDesc: `Admin credited ₹${txnAmount} to your wallet`,
      txnAmount: txnAmount,
      txnType: "credit",
      txnId: Math.floor(Math.random() * Date.now()) + "userCredit",
      orderId: Math.floor(Math.random() * Date.now()) + "userCredit",
      txnStatus: "TXN_SUCCESS",
      txnResource: "Wallet",
      ipAddress: getIpAddress(req),
    });
    await userNewTxn.save();

    successHandler(req, res, {
      remark: "Amount credited to user wallet successfully",
      amount: txnAmount,
    });
    if (type === "debit") {

      const user = await User.findById(userId);
      userWallet.balance -= txnAmount;
      await userWallet.save();

      // adminWallet.wallet.balance += txnAmount;
      // await adminWallet.wallet.save();
      const adminNewTxn = new AdminTxn({
        adminId: adminWallet._id,
        recipientId: userId,
        txnAmount: txnAmount,
        remarks: `Admin debited ₹${txnAmount} from user wallet`,
        txnType: "credit",
        txnId: Math.floor(Math.random() * Date.now()) + "adminDebit",
        txnStatus: "TXN_SUCCESS",
        txnResource: "Wallet",
      });
      await adminNewTxn.save();

      const userNewTxn = new Txn({
        userId: userId,
        recipientId: userId,
        txnName: "Amount Debited",
        txnDesc: `Admin debited ₹${txnAmount} from your wallet`,
        txnAmount: txnAmount,
        txnType: "debit",
        txnId: Math.floor(Math.random() * Date.now()) + "userDebit",
        orderId: Math.floor(Math.random() * Date.now()) + "userDebit",
        txnStatus: "TXN_SUCCESS",
        txnResource: "Wallet",
        ipAddress: getIpAddress(req),
      });
      await userNewTxn.save();
      successHandler(req, res, {
        remark: "Amount debited from user wallet successfully",
        amount: txnAmount,
      });

    }
  }

  if (type === "debit") {

    const user = await User.findById(userId);
    userWallet.balance -= txnAmount;
    await userWallet.save();
    const adminNewTxn = new AdminTxn({
      adminId: adminWallet._id,
      recipientId: userId,
      txnAmount: txnAmount,
      remarks: `Admin debited ₹${txnAmount} from user wallet`,
      txnType: "credit",
      txnId: Math.floor(Math.random() * Date.now()) + "adminDebit",
      txnStatus: "TXN_SUCCESS",
      txnResource: "Wallet",
    });
    await adminNewTxn.save();

    const userNewTxn = new Txn({
      userId: userId,
      recipientId: userId,
      txnName: "Amount Debited",
      txnDesc: `Admin debited ₹${txnAmount} from your wallet`,
      txnAmount: txnAmount,
      txnType: "debit",
      txnId: Math.floor(Math.random() * Date.now()) + "userDebit",
      orderId: Math.floor(Math.random() * Date.now()) + "userDebit",
      txnStatus: "TXN_SUCCESS",
      txnResource: "Wallet",
      ipAddress: getIpAddress(req),
    });
    await userNewTxn.save();
    successHandler(req, res, {
      remark: "Amount debited from user wallet successfully",
      amount: txnAmount,
    });

  }
});


// ===================== Add Money to Wallet =====================
const addMoney = asyncHandler(async (req, res, response) => {
  try {
    const userFound = await User.findById(response.userId);
    // const { _id, deviceToken } = req.data;
    // console.log(_id, '_id')

    // const { txnAmount } = req.body;
    const txnAmount = response.amount;
    console.log("inside add");
    const addToWallet = new Txn({
      userId: userFound._id,
      recipientId: userFound._id,
      txnName: "Add",
      txnDesc: `ADD_MONEY`,
      txnType: "credit",
      txnStatus: "TXN_SUCCESS",
      txnResource: response.txr || "Online",
      orderId: response.txnid,
      txnId: response.txnid,
      txnAmount,
      ipAddress: getIpAddress(req),
      gatewayName: response.gatewayName || "",
    });
    await addToWallet.save();

    const wall = await Wallet.updateOne(
      { userId: userFound._id },
      { $inc: { balance: txnAmount } }
    );
// console.log(wal)
    // notification
    const notification = {
      title: "Added Money",
      body: `₹${txnAmount} rupees added in your wallet`,
    };
    const newNotification = new Notification({
      ...notification,
      sender: userFound._id,
      recipient: userFound._id,
    });
    await newNotification.save();

    // send notification
    userFound.deviceToken &&
      sendNotification(notification, userFound.deviceToken);

    const handleFirstTransaction = async (userId, txnAmount) => {
      // Check if it's the user's first transaction over â‚¹100
      try {
        if (txnAmount >= 100) {
          const user = await User.findById(userId);

          if (user && user.referBy && !user.referBonus) {
            const referalFound = await User.findOne({
              referalId: user.referBy,
            });

            if (referalFound) {
              const GET_REFER_AMOUNT = await appSetting.findOne();

              // Credit the referral bonus
              await Wallet.updateOne(
                { userId: referalFound._id },
                { $inc: { balance: Number(GET_REFER_AMOUNT.referAmount) } }
              );

              // Save transaction recordui
              const refererTxnData = new Txn({
                userId: referalFound._id,
                recipientId: referalFound._id,
                txnName: "Referral Bonus",
                txnDesc: `Referral bonus ‚₹${GET_REFER_AMOUNT.referAmount}.`,
                txnAmount: Number(GET_REFER_AMOUNT.referAmount),
                txnType: "credit",
                txnId: Math.floor(Math.random() * Date.now()) + "refer",
                orderId: Math.floor(Math.random() * Date.now()) + "refer",
                txnStatus: "TXN_SUCCESS",
                txnResource: "Wallet",
                ipAddress: user.ipAddress,
              });
              await refererTxnData.save();
              await User.updateOne({ _id: user._id }, { referBonus: true });
            }
          }
        }
      } catch (error) {
        console.error("Error in handleFirstTransaction:", error || error.message);
        throw new Error("Failed to process referral bonus.");
      }
    };
    const userId = userFound._id;
    await handleFirstTransaction(userId, txnAmount);
    // success respond
    // successHandler(req, res, {
    //   Remarks: "Success fully added to wallet.",
    //   Data: response && response.amount,
    // });
  } catch (error) {
    throw new Error(error || error.message || "Failed to add money to wallet.");
  }
});



module.exports = {
  userCheck,
  getWalletByUser,
  cashback,
  manageUserWalletMoney,
  userWallet,
  getWalletTxn,
  addMoney
};
