const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const axios = require("axios");
const SabPaisaOrder = require("../models/newModels/subPaisaPayment");
const User = require("../models/userSchema");
const Service = require("../models/serviceSchema");
const { addMoney } = require("./wallet");
const successHandler = require("../common/successHandler");
const { generateOrderId } = require("../utils/orderUtils");

// 🔹 AES Encryption function
const encrypt = (text) => {
  const algorithm = "aes-128-cbc";
  const key = Buffer.from(process.env.SABPAISA_AUTH_KEY, "utf8");
  const iv = Buffer.from(process.env.SABPAISA_AUTH_IV, "utf8");
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("base64");
};

// 🔹 AES Decryption function
const decrypt = (text) => {
  const algorithm = "aes-128-cbc";
  const key = Buffer.from(process.env.SABPAISA_AUTH_KEY, "utf8");
  const iv = Buffer.from(process.env.SABPAISA_AUTH_IV, "utf8");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(Buffer.from(text, "base64"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

// 🔹 Create SabPaisa Order (React Native friendly)
exports.createSabPaisaOrder = asyncHandler(async (req, res) => {
  try {
    const _id = "68cf940573e1d1773d42d049"
    const amount = 21

    // ✅ Check service availability
    const service = await Service.findOne({ name: "ADD_MONEY" });
    if (!service?.status) {
      res.status(400);
      throw new Error("This service Temporarily Down");
    }

    // ✅ Check user
    const user = await User.findById(_id);
    if (!user?.status) {
      res.status(400);
      throw new Error("User blocked");
    }
    if (!user.addMoney) {
      res.status(400);
      throw new Error("Service temporarily unavailable");
    }

    if (Number(amount) < 10) {
      res.status(400);
      throw new Error("Minimum ₹10 required");
    }

    // 🔹 Generate unique transaction ID
    const txnId = generateOrderId();
    console.log("user ->", user.phone)
    // 🔹 Prepare request payload


    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;


    const payload = {
      payerName: user.firstName,
      payerEmail: user.email,
      payerMobile: Number(user.phone),
      clientTxnId: txnId,
      amount: Number(amount),
      amountType: "INR",
      clientCode: process.env.SABPAISA_CLIENT_CODE,
      transUserName: process.env.SABPAISA_TRANS_USER,
      transUserPassword: process.env.SABPAISA_TRANS_PASSWORD,
      callbackUrl: process.env.SABPAISA_CALLBACK_URL,
      channelId: "w",
      mcc: "38155", // merchant category code (mcc)
      transData: formattedDate,
      udf1: "ADD_MONEY",
    };
    console.log("payload->", payload);

    // 🔹 Convert payload to query string
    const queryString = Object.keys(payload)
      .map((key) => `${key}=${payload[key]}`)
      .join("&");

    // 🔹 Encrypt payload
    const encryptedData = encrypt(queryString);

    // 🔹 Save order in DB as PENDING
    await SabPaisaOrder.create({
      userId: _id,
      txnId,
      amount,
      status: "PENDING",
    });

    // 🔹 Return data to React Native app
    // return successHandler(res, 200, "SabPaisa order created", {
    //   encData: encryptedData,
    //   spURL: process.env.SABPAISA_PAYMENT_URL, // frontend WebView open karega
    //   txnId,
    // });

    successHandler(req, res, {
      remark: "SabPaisa order created",
      encData: encryptedData,
      clientCode: process.env.SABPAISA_CLIENT_CODE,
      formUrl: process.env.SABPAISA_PAYMENT_URL, // frontend WebView open karega
      txnId,
    })
  } catch (error) {
    console.error("Create SabPaisa Order Error:", error.message);
    throw new Error("Error creating SabPaisa order",);
  }
});

// 🔹 SabPaisa Callback
exports.SabPaisaCallback = asyncHandler(async (req, res) => {
  try {
    let body = "";
    req.on("data", (data) => (body += data));

    req.on("end", async () => {
      try {
        const encryptedResponse = decodeURIComponent(body.split("%")[1].split("=")[1]);
        const decrypted = decrypt(encryptedResponse);

        const responseObj = Object.fromEntries(
          decrypted.split("&").map((item) => item.split("="))
        );

        const { clientTxnId: txnId, status } = responseObj;

        const order = await SabPaisaOrder.findOne({ txnId, status: "PENDING" });
        if (!order) {
          res.status(404);
          throw new Error("Order not found or already processed");
        }

        if (status === "SUCCESS") {
          await addMoney(req, res, {
            userId: order.userId,
            amount: order.amount,
            txnId,
            gateway: "SABPAISA",
          });

          order.status = "SUCCESS";
        } else {
          order.status = "FAILED";
        }

        await order.save();
        return res.send("Callback processed successfully");
      } catch (err) {
        console.error("Callback Decrypt Error:", err.message);
        return res.status(500).send("Error processing callback");
      }
    });
  } catch (error) {
    console.error("SabPaisa Callback Error:", error.message);
    return res.status(500).send("Error in callback");
  }
});

// 🔹 Optional: Server-to-Server Status Check
exports.checkSabPaisaStatus = asyncHandler(async (req, res) => {
  try {
    const { txnId } = req.body;
    if (!txnId) {
      res.status(400);
      throw new Error("Transaction ID is required");
    }

    const order = await SabPaisaOrder.findOne({ txnId });
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Example Status API
    const statusResp = await axios.post(
      process.env.SABPAISA_STATUS_URL,
      {
        clientCode: process.env.SABPAISA_CLIENT_CODE,
        txnId,
      }
    );

    const data = statusResp.data;
    if (data.status === "SUCCESS" && order.status !== "SUCCESS") {
      await addMoney(req, res, {
        userId: order.userId,
        amount: order.amount,
        txnId,
        gateway: "SABPAISA",
      });
      order.status = "SUCCESS";
      await order.save();
    }

    return successHandler(res, 200, "Payment status fetched", data);
  } catch (error) {
    console.error("Check SabPaisa Status Error:", error.message);
    res.status(500);
    throw new Error("Error fetching status");
  }
});












