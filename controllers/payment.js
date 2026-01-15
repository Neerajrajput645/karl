const CryptoJS = require("crypto-js");
const { addMoney } = require("./wallet");
const UPITranzact = require("upitranzact");
const User = require("../models/userSchema");
const txnSchema = require("../models/txnSchema");
const Wallet = require("../models/walletSchema");
const appSetting = require("../models/appSetting");
const Service = require("../models/serviceSchema");
const Transaction = require("../models/txnSchema");
const asyncHandler = require("express-async-handler");
const UpiTenz = require("../models/newModels/UpiTenz");
const successHandler = require("../common/successHandler");
const Notification = require("../models/notificationSchema");
const sendNotification = require("../common/sendNotification");
const getIpAddress = require("../common/getIpAddress");
const CRYPTO_SECRET = process.env.CRYPTO_SECRET;

// ======================= UPI TENZACT INIT =======================
const UPI = new UPITranzact({
  publicKey: process.env.UPI_PUBLIC_KEY,
  secretKey: process.env.UPI_SECRET_KEY,
});

// ======================= HANDLE FIRST TRANSACTION =======================
const handleFirstTransaction = async (userId, txnAmount) => {
  // Check if it's the user's first transaction over â‚¹100
  try {
    if (txnAmount >= 100) {
      const user = await User.findById(userId);

      if (user && user.referBy && !user.referBonus) {
        const referalFound = await User.findOne({ referalId: user.referBy });

        if (referalFound) {
          const GET_REFER_AMOUNT = await appSetting.findOne();

          // Credit the referral bonus
          await Wallet.updateOne(
            { userId: referalFound._id },
            { $inc: { balance: Number(GET_REFER_AMOUNT.referAmount) } }
          );

          // Save transaction recordui
          const refererTxnData = new txnSchema({
            userId: referalFound._id,
            recipientId: referalFound._id,
            txnName: "Referral Bonus",
            txnDesc: `Referral Bonus ₹${GET_REFER_AMOUNT.referAmount}.`,
            txnAmount: Number(GET_REFER_AMOUNT.referAmount),
            txnType: "credit",
            txnId: Math.floor(Math.random() * Date.now()) + "referBonus",
            orderId: Math.floor(Math.random() * Date.now()) + "referBonus",
            txnStatus: "TXN_SUCCESS",
            txnResource: "Wallet",
            ipAddress: user.ipAddress,
          });
          await refererTxnData.save();
          await User.updateOne({ _id: user._id }, { referBonus: true });
        }
      }
    } else {
    }
  } catch (error) {
    console.error("Error in handleFirstTransaction:", error);
    throw new Error("Failed to process referral bonus.");
  }
};

// ======================= HANDLE CASHBACK =======================
const handleCashback = async (
  FindUser,
  cashbackPercent,
  txnId,
  ipAddress,
  walletFound
) => {
  try {
    const addCashBack = new Transaction({
      userId: FindUser._id,
      recipientId: FindUser._id,
      txnName: "Cashback",
      txnDesc: `Cashback ₹${cashbackPercent?.toFixed(2) || 0}, TXN_ID ${txnId}`,
      txnType: "credit",
      txnStatus: "TXN_SUCCESS",
      txnResource: "Wallet",
      txnId: txnId + "cashback",
      orderId: txnId + "cashback",
      txnAmount: cashbackPercent?.toFixed(2) || 0,
      ipAddress,
    });

    await Wallet.findByIdAndUpdate(walletFound._id, {
      $inc: { balance: cashbackPercent },
    });

    await addCashBack.save();

    const notification = {
      title: "Received Cashback",
      body: `Hurray! 🎉 You got ₹${cashbackPercent.toFixed(2) || 0
        } as a cashback.`,
    };

    const newNotification = new Notification({
      ...notification,
      recipient: FindUser._id,
    });

    await newNotification.save();

    // Send notification
    if (FindUser?.deviceToken) {
      sendNotification(notification, FindUser.deviceToken);
    }
  } catch (error) {
    console.error("Cashback handling error:", error);
    throw new Error("Failed to handle cashback.");
  }
};

// ======================= HANDLE REFUND =======================
const handleRefund = async (
  FindUser,
  TxnAmount,
  transactionId,
  ipAddress,
  walletFound
) => {
  try {
    const refundAmount = new Transaction({
      userId: FindUser._id,
      recipientId: FindUser._id,
      txnName: "Refund",
      txnDesc: `Refund ₹${TxnAmount}, TXN_ID ${transactionId} .`,
      txnType: "credit",
      txnStatus: "TXN_SUCCESS",
      txnResource: "Wallet",
      txnId: transactionId + "refund",
      orderId: transactionId + "refund",
      txnAmount: TxnAmount,
      ipAddress: ipAddress,
    });

    await Wallet.findByIdAndUpdate(walletFound._id, {
      $inc: {
        balance: TxnAmount,
      },
    });

    await refundAmount.save();
  } catch (error) {
    console.error("Refund handling error:", error);
    throw new Error("Failed to handle refund.");
  }
};

// ======================= HANDLE DISPUTE REFUND =======================
const handleDisputeRefund = async (
  userFound,
  findTxn,
  findCashbackTxn,
  TransID,
  ipAddress,
  walletFound
) => {
  try {
    const ActualAmount = findCashbackTxn
      ? findTxn.txnAmount - findCashbackTxn.txnAmount
      : findTxn.txnAmount;

    const refundAmount = new Transaction({
      userId: userFound._id,
      recipientId: userFound._id,
      txnName: "Refund",
      txnDesc: `Your ₹${ActualAmount} is Refunded.`,
      txnType: "credit",
      txnStatus: "TXN_SUCCESS",
      txnResource: "Wallet",
      txnId: TransID + "refund",
      orderId: TransID + "refund",
      txnAmount: ActualAmount,
      ipAddress: ipAddress,
    });

    await Wallet.findByIdAndUpdate(walletFound._id, {
      $inc: {
        balance: Number(ActualAmount),
      },
    });

    await refundAmount.save();
  } catch (error) {
    console.error("Refund handling error:", error);
    throw new Error("Failed to handle refund.");
  }
};

// ======================= PAY WITH WALLET =======================
const paywithWallet = asyncHandler(async (req, res) => {
  const { mPin, txnAmount, txnId, serviceId, userId, ipAddress } = req.body;

  const userFound = await User.findById(userId);
  if (!userFound.status) {
    res.status(400);
    throw new Error("User is Blocked");
  }
  const walletFound = await Wallet.findOne({ userId: userFound._id });

  if (txnAmount <= 0) {
    res.status(400);
    throw new Error("TxnAmount Should be positive");
  }

  if (!userFound.mPin) {
    res.status(400);
    throw new Error("Please set mpin");
  }

  // Decrypt mpin
  const decryptMpin = CryptoJS.AES.decrypt(
    userFound.mPin,
    CRYPTO_SECRET
  ).toString(CryptoJS.enc.Utf8);

  if (mPin.toString() !== decryptMpin) {
    res.status(400);
    throw new Error("Please enter a valid mPin");
  }

  const serviceData = serviceId ? await Service.findById(serviceId) : null;

  if (serviceId && !serviceData) {
    res.status(400);
    throw new Error("Please enter a valid ServiceId");
  }

  if (walletFound.balance < txnAmount) {
    res.status(400);
    throw new Error("Wallet balance is low");
  }

  const payAmount = txnAmount;

  // ----------- Create Txn History ------------- //
  const subtractBalance = new Transaction({
    userId: userFound._id,
    recipientId: userFound._id,
    txnName: serviceData?.name || "Service",
    txnDesc: `${serviceData?.name} service.`,
    txnAmount: payAmount,
    txnType: "debit",
    txnStatus: "TXN_SUCCESS",
    txnResource: "Wallet",
    serviceId,
    txnId,
    orderId: txnId,
    ipAddress,
  });

  await subtractBalance.save();

  // Update Wallet Balance
  const updatedWallet = await Wallet.findOneAndUpdate(
    { _id: walletFound._id, balance: { $gte: payAmount } }, // Balance check included
    { $inc: { balance: -payAmount } },
    { new: true }
  );

  if (!updatedWallet) {
    res.status(400);
    throw new Error("Wallet balance is low or deduction failed");
  }

  // Handle First Transaction
  // await handleFirstTransaction(userFound._id, txnAmount);

  // Success Response
  return { ResponseStatus: 1 };
});

// ======================= UPI TENZACT =======================
const createUpiOrder = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.data;
    const { amount, orderId, redirectUrl, note } = req.body;
    console.log("Create UPI Order Request:", req.body);
    // Basic validations
    if (!amount || Number(amount) < 1) {
      res.status(400);
      throw new Error("Minimum amount of 1 rupee is required");
    }

    if (!orderId || !redirectUrl) {
      res.status(400);
      throw new Error("orderId and redirectUrl are required");
    }

    // Service check
    const findService = await Service.findOne({ name: "ADD_MONEY" });
    if (!findService || !findService.status) {
      res.status(400);
      throw new Error("This service is temporarily down");
    }

    // User check
    const user = await User.findById(_id);
    if (!user || !user.status) {
      res.status(400);
      throw new Error("User is blocked");
    }

    if (!user.addMoney) {
      res.status(400);
      throw new Error("Add-money service is temporarily down");
    }

    const wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) {
      res.status(400);
      throw new Error("Wallet not found for user");
    }

    // Save locally BEFORE hitting payment gateway
    console.log("Creating local UPI order record");
    const localOrder = await UpiTenz.create({
      userId: user._id,
      orderId: orderId,
      amount,
      note,
      firstName: user.firstName || "Unknown",
      phone: user.phone,
      status: "PENDING",
    });
    console.log("Local UPI order created:", localOrder);
    const plyd = {
      mid: process.env.UPI_MID,
      amount,
      order_id: orderId,
      redirect_url: redirectUrl,
      note: note || "Add Money",
      customer_name: (user.firstName + " " + user.lastName) || "Unknown",
      customer_email: user.email || "",
      customer_mobile: user.phone,
    }
    console.log("payload", plyd)
    let response = null;
    try{
      
      response = await UPI.createOrder(plyd);
    }catch(error){
      console.log("error =>", error.response.data)
    }
    
    console.log("UPI Order Response:", response);

    // Update local order with UPI order ID
    localOrder.upiOrderId = response?.data?.orderId || null;
    await localOrder.save();
    const finalData = {
      orderId: localOrder.orderId,
      payment_url:
        response?.payment_url ||
        response?.paymentUrl ||
        response?.data?.paymentUrl ||
        response?.data?.payment_url ||
        null,
    };

    return successHandler(req, res, {
      status: true,
      statusCode: 200,
      Remark: "UPI Order created",
      Data: finalData
    });

  }

  catch (error) {
    res.status(500);
    throw new Error("Error creating UPI order: " + (error.response?.data || error.message));
  }
});

// ======================= UPI TENZACT WEBHOOK =======================
const upiTenzWebhook = asyncHandler(async (req, res) => {
  try {
    console.log("webhook called");

    const payload = UPI.handleWebhook(req.body);

    // ---------------- ORDER ID ----------------
    const orderId =
      payload?.order_id ||
      payload?.merchantReferenceId ||
      payload?.data?.order_id ||
      payload?.data?.merchantReferenceId ||
      payload?.raw?.order_id ||
      payload?.raw?.merchantReferenceId ||
      payload?.raw?.data?.order_id ||
      payload?.raw?.data?.merchantReferenceId;

    console.log("Webhook orderId:", orderId);

    // ---------------- TXN STATUS ----------------
    const txnStatus =
      payload?.txnStatus ||
      payload?.status ||
      payload?.data?.txnStatus ||
      payload?.data?.status ||
      payload?.raw?.txnStatus ||
      payload?.raw?.status ||
      payload?.raw?.data?.txnStatus ||
      payload?.raw?.data?.status;

    console.log("Webhook txnStatus:", txnStatus);

    // ---------------- UTR ----------------
    const utr =
      payload?.UTR ||
      payload?.data?.UTR ||
      payload?.utr ||
      payload?.data?.utr ||
      payload?.raw?.UTR ||
      payload?.raw?.utr ||
      payload?.raw?.data?.UTR ||
      payload?.raw?.data?.utr ||
      null;

    console.log("Webhook utr:", utr);

    if (!orderId) {
      console.warn("Webhook missing orderId:", payload);
      return res.status(400).json({ success: false });
    }

    // ---------------- FIND ORDER ----------------
    let order =
      (await UpiTenz.findOne({ orderId })) ||
      (await UpiTenz.findOne({ upiOrderId: orderId }));

    if (!order) {
      console.warn("Order not found for webhook:", orderId);
      return res.status(404).json({ success: false });
    }

    // ---------------- STORE PREVIOUS STATUS ----------------
    const previousStatus = order.status;

    // ---------------- NORMALIZE STATUS ----------------
    let mappedStatus = "FAIL";
    const t = String(txnStatus || "").toUpperCase();

    if (t.includes("SUCCESS")) mappedStatus = "SUCCESS";
    else if (!txnStatus || t.includes("PENDING")) mappedStatus = "PENDING";

    // ---------------- UPDATE ORDER ----------------
    order.status = mappedStatus;
    if (utr) order.utr = utr;
    await order.save();

    // ---------------- WALLET TOP-UP FLOW ----------------
    console.log("order note ->", order.note);

    if (order.note === "Add money to wallet using PG") {
      const isFirstSuccess =
        previousStatus !== "SUCCESS" && mappedStatus === "SUCCESS";

      if (isFirstSuccess) {
        console.log("Adding money to wallet once for:", order.orderId);

        await addMoney(req, res, {
          amount: order.amount,
          userId: order.userId,
          txr: "Wallet",
          gatewayName: "UPI-TENZ",
          txnid: order.orderId,
        });
      } else {
        console.log("Wallet already credited or payment not successful");
      }
    } else {
      // ---------------- CREATE TRANSACTION (ONLINE PAYMENT) ----------------
      console.log("skip add money, creating transaction");

      const service = await Service.findOne({ name: "UPI_MONEY" });

      const transaction = new Transaction({
        userId: order.userId,
        recipientId: order.userId,
        gatewayName: "UPI-TENZ",
        txnName: "Recharge",
        txnDesc: "UPI Payment",
        txnAmount: order.amount,
        txnType: "debit",
        txnId: order.orderId,
        serviceId: service?._id,
        mid: order?.mid,
        orderId: order.orderId,
        txnStatus: mappedStatus === "SUCCESS" ? "TXN_SUCCESS" : "TXN_FAILED",
        txnResource: "Online",
        ipAddress: req.ip || "0.0.0.0",
      });

      await transaction.save();
    }

    // ---------------- NOTIFICATION ----------------
    const user = await User.findById(order.userId);
    if (user?.deviceToken) {
      const dta = {
        title: `₹ ${order.amount} - Payment Successful!`,
        body: `Payment order Id ${order.orderId}`,
      };
      await sendNotification(dta, user.deviceToken);
    }

    console.log("Webhook processed successfully for order:", orderId);
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ success: false });
  }
});


// ======================= UPI TENZACT STATUS CHECK =======================
const upiTenzStatus = asyncHandler(async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      res.status(400);
      throw new Error("orderId is required");
    }
    const order = await UpiTenz.findOne({ orderId });
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    const response = await UPI.checkPaymentStatus(process.env.UPI_MID, orderId);
    console.log("UPI Status Check Response:", response);
    if (!response) {
      res.status(500);
      throw new Error("No response from UPI");
    }

    console.log("UPI Status Response:", response);
    if (order.status !== response.txnStatus) {
      order.status = response.txnStatus;
      await order.save();
    }
    const Data = response.data
    console.log("data", Data)
    Data.status = response?.status;
    console.log("step-1")
    Data.txnStatus = order.status;
    console.log("step-2")
    Data.orderId = order.orderId;
    console.log("step-3")
    delete Data.status;
    console.log("Formatted UPI Status Data:", Data);
    successHandler(req, res, {
      Remarks: "UPI Order Status Fetched",
      Data,
    });
  }
  catch (error) {
    res.status(500);
    throw new Error("Error fetching UPI order status: " + (error.response?.data || error.message));
  }
});

// ======================= UPI TENZACT FINAL STATUS CHECK =======================
const checkStatus = asyncHandler(async (req, res) => {
  const finalStatus = await UPI.autoVerify(process.env.UPI_MID, { order_id: req.body.orderId });
  console.log(finalStatus); // SUCCESS / FAILED / PENDING
  return successHandler(req, res, {
    Remarks: "UPI Order Final Status Fetched",
    Data: { status: `${finalStatus}` },
  });

});


module.exports = {
  createUpiOrder,
  upiTenzWebhook,
  upiTenzStatus,
  checkStatus,
  handleFirstTransaction,
  handleCashback,
  handleRefund,
  handleDisputeRefund,
  paywithWallet
};
