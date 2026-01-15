const asyncHandler = require("express-async-handler");
const axios = require("axios");
// const express = require("express");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const User = require("../../models/userSchema");
const BBPS = require("../../models/service/bbps");
const Wallet = require("../../models/walletSchema");
const DTH = require("../../models/service/dthSchema");
const Service = require("../../models/serviceSchema");
const successHandler = require("../../common/successHandler");
const Recharge = require("../../models/service/rechargeSchema");
const Notification = require("../../models/notificationSchema");
const sendNotification = require("../../common/sendNotification");
const getIpAddress = require("../../common/getIpAddress");
const Commission = require("../../models/newModels/commission");
const Transaction = require("../../models/txnSchema");
const CryptoJS = require("crypto-js");
const normalizedMobileNumber = require("../../common/new/mobileNumberValidation");
const rechargeApiProviderSchema = require("../../models/service/rechargeApiProviderSchema");
const EZYTM_CODES = new Set(["airtel", "airtel_postpaid", "jio", "jio_postpaid"]);

const {
  All_Recharge_Operator_List,
  All_Recharge_Circle_List,
  All_DTH_Recharge_Operator_List,
} = require("../../utils/MockData");
const {
  paywithWallet,
  handleRefund,
  handleCashback,
  handleDisputeRefund,
} = require("../payment");
const { generateOrderId } = require("../../common/generateOrderId");
const CRYPTO_SECRET = process.env.CRYPTO_SECRET;
// const nodemailer = require("nodemailer");
const Users = require("../../models/userSchema");
const planFetchProviderSchema = require("../../models/service/planFetchProviderSchema");
const RechargeOperator = require("../../models/service/rechargeOperatorSchema");
// const rechargeOperatorSchema = require("../../models/service/rechargeOperatorSchema");
const { saveLog } = require("../../common/logger");
const {
  // MobikwikCheckSumGenerate,
  parseXMLToJSON,
} = require("../../common/PayuHashGenerate");
const mobileTypeCheck = require("../../mobileTypeCheck.json");
const crypto = require("crypto");

const genTxnId = () => {
  // Generate an 8-digit unique ID
  const randomPart = crypto.randomBytes(4).toString("hex"); // 8 hex characters
  return "TXNPP" + randomPart.slice(0, 8).toUpperCase(); // TXN + 8 = 16 total
};

const unTxnHandle = async (ipAddress, userId, rcPrice,) => {
  const txn = await Transaction.findOne({
    userId,
    ipAddress,
    txnAmount: rcPrice,
    // txnResource: "Online",
    txnStatus: "TXN_SUCCESS",
    // time should be within last 15 minutes
    createdAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) },
  });
  if (!txn) {
    return null;
  }
  const [recharge, dth, bbps] = await Promise.all([
    Recharge.findOne({ transactionId: txn?.orderId }),
    DTH.findOne({ transactionId: txn?.orderId }),
    BBPS.findOne({ transactionId: txn?.orderId }),
  ]);
  if (recharge || dth || bbps) {
    return null;
  }
  return txn.orderId;
}


// ===================== Mobile Recharge =====================
const planFetch = asyncHandler(async (req, res) => {

  const { Operator_Code, Circle_Code } = req.query;
  console.log("mobile number before normalization", req.query?.MobileNumber);
  const MobileNumber = normalizedMobileNumber(req.query?.MobileNumber);
  console.log(req.query, "plan fetch req.query");
  // console.log("mobile number after normalization", normalizedNumber);
  const selectedOperator = await planFetchProviderSchema.findOne({
    isTrue: true,
  });
  console.log(selectedOperator, "selectedOperator");

  if (selectedOperator.providerCode === 1) {
    const findOp = All_Recharge_Operator_List.find(
      (a) => a.PlanApi_Operator_code == Operator_Code
    );
    const findCir = All_Recharge_Circle_List.find(
      (a) => a.planapi_circlecode == Circle_Code
    );
    const plans = await axios.get(
      `https://alpha3.mobikwik.com/recharge/plans/v2/rechargePlansAPI/${findOp.Mobikwik_Operator_code}/${findCir.Mobikwik_circlecode}`,
      {
        headers: {
          "X-Mclient": "14",
        },
      }
    );

    // if error
    if (!plans.data.success) {
      res.status(400);
      throw new Error("Errors in Plan Fetching");
    }

    // const Plans = await plans.data.

    // success respond
    successHandler(req, res, {
      Remarks: "All plans",
      Data: plans?.data.data.plans,
    });
  } else if (selectedOperator.providerCode === 2) {
    const findOp = All_Recharge_Operator_List.find(
      (a) => a.PlanApi_Operator_code == Operator_Code
    );
    // console.log(findOp, "findOp");
    const findCir = All_Recharge_Circle_List.find(
      (a) => a.planapi_circlecode == Circle_Code
    );
    // console.log(findOp, "findCir");

    const plans = await axios.get(
      `http://planapi.in/api/Mobile/Operatorplan?apimember_id=${process.env.PLAN_API_USER_ID}&api_password=${process.env.PLAN_API_PASSWORD}&cricle=${findCir.planapi_circlecode}&operatorcode=${findOp.PlanApi_Operator_code}`
    );
    // console.log(plans.data, "plans");
    // if error
    if (plans.data.STATUS != 0) {
      res.status(400);
      throw new Error("Errors in Plan Fetching");
    }

    const flattenRDATA = (data) => {
      let result = [];
      for (let key in data) {
        if (Array.isArray(data[key])) {
          result = result.concat(data[key]);
        }
      }
      return result;
    };

    const flattenedArray = flattenRDATA(plans?.data.RDATA);

    if (["Airtel", "VI"].includes(findOp.Operator_name)) {
      // Fetch ROFFER data
      const rofferResponse = await axios.get(
        `http://planapi.in/api/Mobile/RofferCheck?apimember_id=${process.env.PLAN_API_USER_ID}&api_password=${process.env.PLAN_API_PASSWORD}&operator_code=${findOp.PlanApi_Operator_code}&mobile_no=${MobileNumber}`
      );

      // console.log(rofferResponse.data, "rofferResponse");

      const rofferData = rofferResponse.data.RDATA.map((roffer) => ({
        Type: "roffer",
        rs: parseInt(roffer.price, 10), // Ensure price is numeric
        validity: "N/A",
        desc: `${roffer.logdesc} | ${roffer.ofrtext}`,
      }));

      // Create a map for ROFFER data based on 'rs' (price)
      const rofferMap = new Map(
        rofferData.map((roffer) => [roffer.rs, roffer])
      );

      // Replace overlapping plans and combine unique ROFFER plans
      const mergedPlans = flattenedArray.map((plan) =>
        rofferMap.has(plan.rs) ? rofferMap.get(plan.rs) : plan
      );

      rofferData.forEach((roffer) => {
        if (!mergedPlans.some((plan) => plan.rs === roffer.rs)) {
          mergedPlans.push(roffer); // Add unique ROFFER plans
        }
      });

      // success respond
      successHandler(req, res, {
        Remarks: "All plans",
        image: findOp.img,
        Data: (mergedPlans),
      });
    } else {
      successHandler(req, res, {
        Remarks: "All plans",
        image: findOp.img,
        Data: (flattenedArray),

      });
    }
  }
});


const BillhubComplainRaise = asyncHandler(async (req, res) => {
  try {
    const { order_id, message } = req.query;
    const response = await axios.get(
      `https://api.techember.in/app/complaints/main.php?token=${process.env.BILLHUB_TOKEN}&order_id=${order_id}&message=${message}`
    );
    console.log(response, "Billhub Complain Response");
    // success respond
    successHandler(req, res, {
      Remarks: "Complained Raised",
      Data: response?.data,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// ===================== Mobile Recharge =====================
const rechargeRequest = asyncHandler(async (req, res) => {
  try {
    //throw new Error("Recharge API is currently disabled for maintenance.");
    const { _id, deviceToken } = req.data;
    const ipAddress = getIpAddress(req);
    const { number, amount, mPin, operator, circle, type } = req.query;
    let transactionId = req.query?.ord || req.body?.ord; // add custom transaction id support
    if (type === "wallet") {
      transactionId = genTxnId();
      console.log("Generated Transaction ID for wallet recharge:", transactionId);
    }
    const isPrepaid = Boolean(req.query.isPrepaid);
    const TxnAmount = Number(amount);
    console.log("req.query", req.query);
    const [findService, FindUser, walletFound] = await Promise.all([
      Service.findOne({ name: "Recharge" }),
      Users.findOne({ _id }),
      Wallet.findOne({ userId: _id }),
    ]);

    if (!findService?.status) {
      console.log("step-1", findService.name)
      return res.status(400).json({
        Error: true,
        Status: false,
        ResponseStatus: 0,
        StatusCode: "Ex400",
        Remarks: "Recharge service is currently unavailable. Please try again later."
      })
    }
    console.log("step0", FindUser.firstName, walletFound.userId);

    if (!FindUser.status) {
      return res.status(400).json({
        Error: true,
        Status: false,
        ResponseStatus: 0,
        StatusCode: "Ex400",
        Remarks: "User is Blocked"
      });
    }

    if (!FindUser?.recharge) {
      return res.status(400).json({
        Error: true,
        Status: false,
        ResponseStatus: 0,
        StatusCode: "Ex400",
        Remarks: "Recharge service is currently unavailable. Please try again later."
      });
    }
    console.log("step1");
    if (TxnAmount <= 0) {
      return res.status(400).json({
        Error: true,
        Status: false,
        ResponseStatus: 0,
        StatusCode: "Ex400",
        Remarks: "Amount should be positive."
      });
    }
    if (type == "wallet") {
      if (!req.data.mPin) {
        return res.status(400).json({
          Error: true,
          Status: false,
          ResponseStatus: 0,
          StatusCode: "Ex400",
          Remarks: "Please set an mPin."
        });
      }
      console.log("step2");
      // Decrypt mPin
      const decryptMpin = CryptoJS.AES.decrypt(
        req.data.mPin,
        CRYPTO_SECRET
      ).toString(CryptoJS.enc.Utf8);

      if (mPin.toString() !== decryptMpin) {
        return res.status(400).json({
          Error: true,
          Status: false,
          ResponseStatus: 0,
          StatusCode: "Ex400",
          Remarks: "Please enter a valid mPin."
        });
      }

      console.log("step3");

      if (walletFound.balance < TxnAmount) {
        console.log("wallet balance low", walletFound.balance)
        return res.status(400).json({
          Error: true,
          Status: false,
          ResponseStatus: 0,
          StatusCode: "Ex400",
          Remarks: "User wallet balance is low."
        });
      }
    }
    // Fetch OPerator & Circle
    console.log("step4");
    const findOperator = All_Recharge_Operator_List.find(
      (a) => a.PlanApi_Operator_code == operator
    );
    console.log("step5");
    const findCircle = All_Recharge_Circle_List.find(
      (a) => a.planapi_circlecode == circle
    );
    console.log("step6");
    if (
      !findCircle?.planapi_circlecode ||
      !findOperator?.PlanApi_Operator_code
    ) {
      return res.status(400).json({
        Error: true,
        Status: false,
        ResponseStatus: 0,
        StatusCode: "Ex400",
        Remarks: "Invalid Operator or Circle."
      });
    }
    console.log("step7");

    console.log("step8");
    const body = {
      orderId: transactionId,
      txnAmount: TxnAmount,
      txnId: transactionId,
      serviceId: findService._id,
      mPin,
      userId: FindUser._id,
      ipAddress,
    };
    console.log("step-8.5")
    let res1 = {
      ResponseStatus: 1
    };
    if (type === "wallet") {
      res1 = await paywithWallet({ body });
    }
    console.log("Wallet Payment Response:", res1);
    if (res1.ResponseStatus == 1) {
      console.log("Payment successful, proceeding with recharge.");
      
      function capitalize(word) {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      
      // Determine which API to use based on operator
      const operatorName = findOperator.Operator_name?.toLowerCase() || "";
      const isAirtelOrJio = operatorName.includes('airtel') || operatorName.includes('jio');
      const useEZTYM = isAirtelOrJio;
      
      console.log(`Operator: ${operatorName}, Using API: ${useEZTYM ? 'EZTYM' : 'BILLHUB'}`);
      
      // Create recharge record
      const newRecharge = new Recharge({
        userId: FindUser._id,
        number,
        operator: findOperator.PlanApi_Operator_code,
        circle: findCircle.planapi_circlecode,
        amount: TxnAmount,
        transactionId,
        status: "pending",
        operatorRef: 0,
        apiTransID: transactionId,
        ipAddress,
        provider: useEZTYM ? "EZTYM" : "Billhub",
        isPrepaid,
      });
      await newRecharge.save();

      console.log("step11");
      try {
        let bodyData;
        let apiUrl;
        let apiName;
        
        if (useEZTYM) {
          // EZTYM API for Airtel and Jio
          apiName = "EZTYM";
          apiUrl = "https://api.roboticexchange.in/Robotics/webservice/GetMobileRecharge";
          bodyData = {
            Apimember_id: process.env.EZYTM_API_MEMBER_ID,
            Api_password: process.env.EZYTM_API_PASSWORD,
            Mobile_no: number,
            Operator_code: findOperator.Cyrus_Operator_code,
            Amount: TxnAmount,
            Member_request_txnid: transactionId,
            Circle: findCircle.planapi_circlecode
          };
        } else {
          // BILLHUB API for other operators
          apiName = "BILLHUB";
          apiUrl = "https://api.techember.in/app/recharges/main.php";
          bodyData = {
            token: process.env.BILLHUB_TOKEN,
            number: number,
            op_uid: findOperator.Billhub_Operator_code,
            amount: TxnAmount,
            order_id: transactionId,
            type: isPrepaid ? "prepaid" : "postpaid",
            circle: findCircle.planapi_circlecode,
          };
        }

        console.log(`${apiName} Request Body:`, bodyData);

        let response;
        let rechargeRe;

        try {
          console.log(`Calling ${apiName} Recharge API`);
          
          if (useEZTYM) {
            rechargeRe = await axios.get(apiUrl, { params: bodyData, timeout: 30000 });
          } else {
            rechargeRe = await axios.post(apiUrl, bodyData);
          }
          
          console.log(`${apiName} response received ->`, rechargeRe.data);
          response = rechargeRe.data;
        } catch (error) {
          console.log(`${apiName} API error ->`, error);
          if (error.response) {
            response = error.response.data;
          } else {
            response = { error: error.message };
          }
        }

        // Process response based on API
        let status;
        let operatorRef;
        
        if (useEZTYM) {
          // EZTYM response processing
          const statusMap = {
            1: "success",
            2: "pending",
            3: "failed",
          };
          status = statusMap[response?.STATUS] || "unknown";
          operatorRef = response?.OPTRANSID || 0;
        } else {
          // BILLHUB response processing
          status = response?.status?.toLowerCase() || "unknown";
          operatorRef = response?.operator_ref_id || 0;
        }

        await saveLog(
          "MOBILE_RECHARGE",
          apiUrl,
          bodyData,
          response,
          `Recharge response received from ${apiName} for TxnID: ${transactionId}, Status: ${status}`
        );

        if (!response || status === "pending") {
          newRecharge.status = "pending";
          newRecharge.operatorRef = operatorRef;
          await newRecharge.save();
          
          successHandler(req, res, {
            Remarks: `Your Recharge is Pending`,
            Data: ({
              status: "PENDING",
              operator_ref_id: operatorRef,
            }),
          });
          return;
        }

        newRecharge.rawResponse = response;
        newRecharge.status = status;
        newRecharge.operatorRef = operatorRef;
        await newRecharge.save();

        if (status == "failed" || status == "error") {
          // Start Refund-------------------------------------------------
          await handleRefund(
            FindUser,
            TxnAmount,
            transactionId,
            ipAddress,
            walletFound
          );
          console.log("Recharge Failed, Refund Processed");
          // End Refund ------------------------------------------------------------------
          return res.status(400).json({
            Error: true,
            Status: false,
            ResponseStatus: 0,
            StatusCode: "Ex400",
            Remarks: useEZTYM ? 
              (response.MESSAGE || "Recharge Failed, Please Try Again") :
              (response.message || "Recharge Failed, Please Try Again")
          });
        }

        // Start Cashback--------------------------
        if (status == "success" && isPrepaid) {
          console.log("Processing Cashback", findService._id);
          const op = findOperator.com_name;
          console.log("Operator for Cashback:", op);
          const commission = await Commission.findOne({ name: op, status: true });
          console.log("Commission Details:", commission);
          let cashback = commission ? commission?.commission : 0;
          console.log("Cashback Percent:", cashback);
          if (commission?.symbol === "%") {
            cashback = (TxnAmount / 100) * cashback;
            console.log("Calculated Cashback Amount:", cashback);
          }

          await handleCashback(
            FindUser,
            cashback,
            transactionId,
            ipAddress,
            walletFound
          );
        }
        // End Cashback ---------------------------

        const notification = {
          title: `Recharge ${status}`,
          body: `Your ₹${TxnAmount} recharge is ${status}`,
        };

        const newNotification = new Notification({
          ...notification,
          recipient: _id,
        });

        await newNotification.save();
        if (deviceToken) {
          sendNotification(notification, deviceToken);
        }

        console.log(
          "status", capitalize(status),
          "number", newRecharge.number,
          "transactionId", newRecharge.transactionId,
          "operatorName", findOperator?.Operator_name,
          "operator_ref_id", operatorRef,
          "provider", apiName
        );

        successHandler(req, res, {
          Remarks: `Your Recharge is ${status}`,
          Data: ({
            status: capitalize(status),
            transactionId: newRecharge.transactionId,
            phoneNumber: newRecharge.number,
            debitFrom: "Wallet",
            operatorName: findOperator?.Operator_name || "Unknown Operator",
            operator_ref_id: operatorRef,
            provider: apiName
          }),
        });
      } catch (error) {
        if (error.code === "ECONNABORTED") {
          // Timeout Error Handling
          newRecharge.status = "pending";
          newRecharge.rawResponse = "Request timed out";
          await newRecharge.save();

          await saveLog(
            "MOBILE_RECHARGE",
            null,
            null,
            error?.response?.data || error.message,
            `Request timed out for TxnID: ${transactionId}`
          );

          successHandler(req, res, {
            Remarks: `Your Recharge is Pending`,
            Data: ({ status: "PENDING" }),
          });
        } else {
          // Other Errors
          newRecharge.status = "pending";
          newRecharge.rawResponse = error.message;
          await newRecharge.save();
          await saveLog(
            "MOBILE_RECHARGE",
            null,
            null,
            error?.response?.data || error.message,
            `Error during recharge for TxnID: ${transactionId}`
          );
          return res.status(400).json({
            Error: true,
            Status: false,
            ResponseStatus: 0,
            StatusCode: "Ex400",
            Remarks: error.message
          });
        }
      }
    } else {
      return res.status(400).json({
        Error: true,
        Status: false,
        ResponseStatus: 0,
        StatusCode: "Ex400",
        Remarks: "Payment Failed, Please Contact to Customer Care"
      });
    }
  } catch (error) {
    return res.status(400).json({
      Error: true,
      Status: false,
      ResponseStatus: 0,
      StatusCode: "Ex400",
      Remarks: error.message
    });
  }
});

const rechargeStatus = asyncHandler(async (req, res) => {
  const { transid } = req.query;
  const rechargeSt = await axios.get(
    `https://api.techember.in/app/check-status.php?token=${process.env.TECHED_TOKEN}&order_id=${transid}`
  );
  console.log(rechargeSt, "rechargeSt.data");
  successHandler(req, res, {
    Remarks: "Recharge request",
    Data: rechargeSt.data
  });
});


// -------------------------- DTH Recharge --------------------------

const fetchDthPlans = asyncHandler(async (req, res) => {
  try {
    const operatorCode = req.query.operatorCode || 27;
    const apimember_id = process.env.PLAN_API_USER_ID;
    const api_password = process.env.PLAN_API_PASSWORD_hash;
    console.log(req.body);
    const url = "https://planapi.in/api/Mobile/DthPlans";

    const response = await axios.get(url, {
      params: {
        apimember_id,
        api_password,
        operatorcode: operatorCode,
      },
    });

    const data = response.data;
    console.log("dth plan fetch");
    // ✅ Safely extract base fields
    const operator = data?.Operator || "Unknown";
    const combos = data?.RDATA?.Combo || [];

    // ✅ Flatten all plans
    let plans = [];
    for (const combo of combos) {
      const language = combo.Language || "N/A";
      for (const detail of combo.Details || []) {
        const planName = detail.PlanName || "N/A";
        const channels = detail.Channels || "N/A";
        const hdChannels = detail.HdChannels || "N/A";
        const paidChannels = detail.PaidChannels || "N/A";
        const lastUpdate = detail.last_update || null;

        for (const price of detail.PricingList || []) {
          plans.push({
            language,
            planName,
            channels,
            paidChannels,
            hdChannels,
            lastUpdate,
            amount: Number(price.Amount.replace(/[₹\s]/g, "")) || 0,
            month: price.Month,
          });
        }
      }
    }

    // ✅ Apply filters if provided
    const { language, planName, month, price, priceOp } = req.query;

    if (language) {
      plans = plans.filter((p) =>
        p.language.toLowerCase().includes(language.toLowerCase())
      );
    }

    if (planName) {
      plans = plans.filter((p) =>
        p.planName.toLowerCase().includes(planName.toLowerCase())
      );
    }

    if (month) {
      plans = plans.filter((p) =>
        p.month.toLowerCase().includes(month.toLowerCase())
      );
    }

    if (price && priceOp) {
      const priceValue = Number(price);
      if (!isNaN(priceValue)) {
        if (priceOp === "<") plans = plans.filter((p) => p.amount < priceValue);
        else if (priceOp === ">")
          plans = plans.filter((p) => p.amount > priceValue);
        else if (priceOp === "=")
          plans = plans.filter((p) => p.amount === priceValue);
      }
    }

    // ✅ Structured response for frontend
    const formattedResponse = {
      Error: false,
      Status: true,
      ResponseStatus: 1,
      Remarks: "DTH Plans fetched successfully",
      Data: {
        operator,
        totalPlans: plans.length,
        plans,
      },
    };
    console.log("plan fetch successfully");

    return successHandler(req, res, formattedResponse);
  } catch (error) {
    console.error("Error fetching DTH plans:", error.message);
    throw new Error(error.message || "Unable to fetch DTH plans");
  }
});


const fetchDthOperator = asyncHandler(async (req, res) => {
  try {
    const { dthNumber } = req.query;
    if (!dthNumber) {
      throw new Error("DTH number is required");
    }

    const params = {
      apimember_id: process.env.PLAN_API_USER_ID,
      api_password: process.env.PLAN_API_PASSWORD_hash,
      dth_number: dthNumber,
      // Opcode: 24, // Operator code for DTH - FOR MORE DETAILS
      // mobile_no: dthNumber, - for more details
    };




    const url = "https://planapi.in/api/Mobile/DthOperatorFetch";
    // const url = "https://planapi.in/api/Mobile/DthInfoWithLastRechargeDate"; // for more details

    const { data } = await axios.get(url, { params });

    console.log(data, "dth operator data");


    try {
      let userName = "Unknown";
      const detailsParams = {
        apimember_id: process.env.PLAN_API_USER_ID,
        api_password: process.env.PLAN_API_PASSWORD_hash,
        dth_number: dthNumber,
        Opcode: data.DthOpCode, // Operator code for DTH - FOR MORE DETAILS
        mobile_no: dthNumber, // - for more details
      };

      const dthurl = "https://planapi.in/api/Mobile/DthInfoWithLastRechargeDate"; // for more details

      const { data: news } = await axios.get(dthurl, { params: detailsParams });


      // userName = data.DATA.Name;
      console.log("------------------------------------------------------------------");
      // console.log("qwe",news.DATA.Name)
      if (!news?.DATA?.Name) {
        return res.status(404).json({
          Error: true,
          Status: false,
          ResponseStatus: 0,
          StatusCode: "Ex404",
          Remarks: "Wrong DTH ID"
        });
      }
      data.userName = news.DATA.Name
      console.log(news.DATA.Name, "dth details data");
      console.log("------------------------------------------------------------------");
    }
    catch (error) {
      console.error("DTH Recharge Pre-fetch Error:", error.message || error.response?.data || error);
    }



    return successHandler(req, res, {
      Error: false,
      Status: true,
      Data: data,
    });
  } catch (error) {
    // console.error("DTH Operator Fetch Error:", error.message);
    throw new Error(error.message || "Unable to fetch DTH operator info");
  }
});

const fetchDthOpDetails = asyncHandler(async (req, res) => {
  try {
    const { dthNumber, operatorCode } = req.query;
    if (!dthNumber) {
      throw new Error("DTH number is required");
    }

    const params = {
      apimember_id: process.env.PLAN_API_USER_ID,
      api_password: process.env.PLAN_API_PASSWORD_hash,
      dth_number: dthNumber,
      Opcode: operatorCode, // Operator code for DTH - FOR MORE DETAILS
      mobile_no: dthNumber, // - for more details
    };

    console.log(params, "params");

    // const url = "https://planapi.in/api/Mobile/DthOperatorFetch";
    const url = "https://planapi.in/api/Mobile/DthInfoWithLastRechargeDate"; // for more details

    const { data } = await axios.get(url, { params });

    return successHandler(req, res, {
      Error: false,
      Status: true,
      Data: data,
    });
  } catch (error) {
    // console.error("DTH Operator Fetch Error:", error.message);
    throw new Error(error.message || "Unable to fetch DTH operator info");
  }
});


const dthRequest = asyncHandler(async (req, res) => {
  console.log("dth Request Initiated")
  const findService = await Service.findOne({ name: "DTH" });
  const ipAddress = getIpAddress(req);

  if (!findService?.status) {
    res.status(400);
    throw new Error("DTH service is currently unavailable. Please try again later.");
  }
  console.log("Found Service:", findService?.name)
  const { _id, deviceToken } = req.data;
  const FindUser = await Users.findById(_id);
  if (!FindUser?.status) {
    res.status(400);
    throw new Error("User is Blocked");
  }
  console.log("Found User:", FindUser?.firstName)
  if (!FindUser?.dth) {
    res.status(400);
    throw new Error("DTH service is currently unavailable for your account. Please try again later.");
  }

  const { number, operator, amount, mPin, type } = req.query;
  let transactionId = req.query?.ord || req.body?.ord; // add custom transaction id support
  console.log("query -> ", req.query)
  const txnAmount = Number(amount);
  if (txnAmount <= 0) {
    res.status(400);
    throw new Error("Amount should be positive.");
  }
  if (operator == 28 && txnAmount < 200) {
    res.status(400);
    throw new Error("Minimum Amount for Tata Sky should be greater than 200");
  }
  else if (operator == 25 && txnAmount < 100) {
    res.status(400);
    throw new Error("Minimum Amount for Dish TV should be greater than 100");
  }
  else if (operator == 29 && txnAmount < 100) {
    res.status(400);
    throw new Error("Minimum Amount for Videocon should be greater than 200");
  }
  else if (operator == 24 && txnAmount < 100) {
    res.status(400);
    throw new Error("Minimum Amount for Dish TV should be greater than 200");
  }
  const walletFound = await Wallet.findOne({ userId: _id });
  // const orderId = generateOrderId();
  if (type === "wallet" && !transactionId) {
    transactionId = genTxnId();
    console.log("Generated Transaction ID for wallet DTH recharge:", transactionId);
  }
  if (type === "wallet") {
    console.log("Wallet payment selected")
    if (!req.data.mPin) {
      res.status(400);
      throw new Error("Please set an mPin.");
    }
    // 🔐 Decrypt mPin
    const decryptMpin = CryptoJS.AES.decrypt(req.data.mPin, CRYPTO_SECRET).toString(CryptoJS.enc.Utf8);
    if (mPin.toString() !== decryptMpin) {
      res.status(400);
      throw new Error("Please enter a valid mPin.");
    }

    // 💰 Wallet Check
    if (!walletFound || walletFound.balance < txnAmount) {
      res.status(400);
      throw new Error("Insufficient wallet balance.");
    }
  }
  console.log("Starting transaction")
  // ✅ Start Transaction
  const payBody = {
    orderId: transactionId,
    txnAmount,
    txnId: transactionId,
    serviceId: findService._id,
    userId: _id,
    ipAddress,
  };

  if (mPin) {
    payBody.mPin = mPin;
  }
  console.log("payBody -> ", payBody)
  let userName = "Unknown";
  try {

    const detailsParams = {
      apimember_id: process.env.PLAN_API_USER_ID,
      api_password: process.env.PLAN_API_PASSWORD_hash,
      dth_number: number,
      Opcode: operator, // Operator code for DTH - FOR MORE DETAILS
      mobile_no: number, // - for more details
    };
    console.log("detailsParams -> ", detailsParams)
    const dthurl = "https://planapi.in/api/Mobile/DthInfoWithLastRechargeDate"; // for more details

    const { data } = await axios.get(dthurl, { params: detailsParams });
    userName = data.DATA.Name;
    console.log("------------------------------------------------------------------");
    console.log(data.DATA.Name, "dth details data");
    console.log("------------------------------------------------------------------");
  }
  catch (error) {
    console.error("DTH Recharge Pre-fetch Error:", error.message || error.response?.data || error);
  }

  try {
    let walletRes = {
      ResponseStatus: 1
    }
    if (type === "wallet") {
      walletRes = await paywithWallet({ body: payBody });
    }
    if (walletRes.ResponseStatus !== 1) {
      res.status(400);
      throw new Error("Payment Failed, Please Contact to Customer Care");
    }
    console.log("Wallet response", walletRes)
    console.log("req.body", req.body);
    console.log("req.query", req.query);
    // 🔎 Validate operator
    console.log(operator)
    const findOperator = All_DTH_Recharge_Operator_List.find(
      (a) => a.planApi_operator_code == operator
    );
    console.log("es1", findOperator)
    if (!findOperator) {
      return res.status(400).json({
        ResponseStatus: 0,
        Remark: "Invalid operator selected.",
        Success: false,
        Error: true
      });
    }
    console.log(findOperator, "find op")
    const URL = "https://api.techember.in/app/recharges/main.php";
    const bodyData = {
      token: process.env.BILLHUB_TOKEN,
      number,
      op_uid: findOperator.Billhub_Operator_code,
      amount: txnAmount,
      order_id: transactionId,
      type: "dth",
      circle: "N/A",
    };

    await saveLog("DTH_RECHARGE", URL, bodyData, null, `Recharge initiated for TxnID: ${transactionId}`);

    // 🔌 Call Billhub API

    // const rechargeRe = {
    //   data: {
    //     status: 'success',
    //     order_id: '1762671148848568',
    //     margin: '0.8250',
    //     margin_percentage: '0.1283',
    //     operator_ref_id: null
    //   }
    // }

    console.log("some is running");

    const rechargeRe = await axios.post(URL, bodyData);

    // if (rechargeRe) {
    //   console.log("dummy api running");
    // }

    console.log("data", rechargeRe);

    const rechargeData = rechargeRe.data || {};
    const status = rechargeData.status?.toLowerCase() || "unknown";
    console.log("Recharge data", rechargeData, status)
    await saveLog(
      "DTH_RECHARGE",
      URL,
      bodyData,
      rechargeData,
      `Recharge response for TxnID: ${transactionId}, Status: ${status}`
    );

    // 🧾 Always record recharge attempt
    const newRecharge = await DTH.create({
      userId: _id,
      number,
      operator,
      amount: txnAmount,
      transactionId,
      userName,
      status: rechargeData.status,
      operatorRef: rechargeData.operator_ref_id || 0,
      apiTransID: rechargeData.order_id || 0,
      ipAddress,
      provider: "Billhub",
    });

    console.log("New recharge record created:", newRecharge);
    // ❌ Failed Recharge → Refund
    if (["failed", "error", "failure"].includes(status)) {
      await handleRefund(FindUser, txnAmount, transactionId, ipAddress, walletFound);
      console.log("Recharge failed, amount refunded.")
      res.status(400);
      throw new Error(rechargeData.message || rechargeData.ErrorMessage || "DTH Recharge Failed, Please Try Again Ex400");
    }

    // ✅ Pending / Success / Accepted
    const notification = {
      title: `DTH Recharge ${rechargeData.status}`,
      body: `Your ₹${txnAmount} DTH recharge is ${rechargeData.status}`,
    };
    await Notification.create({ ...notification, recipient: _id });
    if (deviceToken) sendNotification(notification, deviceToken);

    // 🎁 Cashback only on success
    if (status === "success") {
      console.log("Processing cashback for successful recharge");

      const op = findOperator.Operator_name;
      console.log("Operator for Cashback:", op);

      const commission = await Commission.findOne({ name: op, status: true });
      console.log("Commission Details:", commission);

      if (!commission) {
        console.log("No commission found. Skipping cashback.");
      } else {
        let cashbackAmount = 0;

        // ✅ SYMBOL BASED CASHBACK LOGIC
        if (commission.symbol === "%") {
          cashbackAmount = (txnAmount / 100) * commission.commission;
          cashbackAmount = parseFloat(cashbackAmount.toFixed(2));
          console.log("Percentage Cashback Applied:", cashbackAmount);
        }
        else if (commission.symbol === "₹") {
          cashbackAmount = parseFloat(commission.commission.toFixed(2));
          console.log("Flat Cashback Applied:", cashbackAmount);
        }
        else {
          cashbackAmount = 0;
          console.log("Invalid commission symbol. Cashback skipped.");
        }

        // ✅ Apply cashback only if greater than 0
        if (cashbackAmount > 0) {
          await handleCashback(
            FindUser,
            cashbackAmount,
            transactionId,
            ipAddress,
            walletFound
          );
        } else {
          console.log("Cashback amount is 0. Nothing credited.");
        }
      }
    }


    // ✅ Always respond (success/pending/accepted)
    return successHandler(req, res, {
      Remarks:
        rechargeData.message ||
        rechargeData.ErrorMessage ||
        `Recharge ${status}`,
      Data: rechargeData,
      ResponseStatus: 1
    });

  } catch (error) {
    console.error("DTH Recharge Error:", error.response.data.message);

    // ⚙️ Auto-refund on API error (if wallet already deducted)
    try {
      console.log("Attempting refund due to API error");
      await handleRefund(FindUser, txnAmount, transactionId, ipAddress, walletFound);
      console.log("Refund processed due to API error");
    } catch (refundErr) {
      console.error("Refund Error:", refundErr.message);
    }

    await saveLog(
      "DTH_RECHARGE",
      null,
      null,
      error?.response?.data || error?.message,
      `Error during recharge for TxnID: ${transactionId}`
    );

    res.status(400);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "DTH Recharge Failed, Please Try Again Ex400"
    );
  }
});


// recharge history by User
const rechargeHistory = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const hist = await Recharge.find({ userId: _id }).sort({ createdAt: -1 }); // Sort by createdAt field in descending order

  // success handler
  successHandler(req, res, {
    Remarks: "User Recharge History",
    Data: hist,
  });
});

// ======================= Mobile operator & circle fetch =======================
const Get_Operator_Circle_By_Phone = asyncHandler(async (req, res) => {
  const { phone } = req.query;

  if (!phone) {
    res.status(400);
    throw new Error("Phone Number is Mandatory");
  }

  let response = await axios.get(
    `http://planapi.in/api/Mobile/OperatorFetchNew?ApiUserID=${process.env.PLAN_API_USER_ID}&ApiPassword=${process.env.PLAN_API_PASSWORD}&Mobileno=${phone}`
  );
  if (response.data.STATUS == 3) {
    res.status(400);
    throw new Error(response.data.Message);
  } else {
    const operatorTypeFilter = mobileTypeCheck
      .filter(a => a.op_code === response.data.op_code)
      .map(a => a.type);
    response.data.operatorType = operatorTypeFilter.length > 0 ? operatorTypeFilter[0] : "N/A";
    response.data.Mobile = normalizedMobileNumber(response.data.Mobile);
    console.log("operatorTypeFilter", response.data);
    successHandler(req, res, {
      Remarks: "Operator & Circle Fetch Success",
      Data: response.data,
    });
  }
});

//  recharge history by admin
const rechargeHistoryByAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.body.pageNumber) || 1; // Default page number is 1
  const pageSize = parseInt(req.body.pageSize) || 20; // Default page size is 20
  const searchVal = req.body.search || "";
  const selectVal = req.body.select || "";
  const startDate = new Date(req.body.startDate) || "";
  const endDate = new Date(req.body.endDate) || "";
  const activeTab = req.body.activeTab || "";

  let allRecharges;
  let LastPage;

  if (
    searchVal ||
    selectVal ||
    req.body.startDate ||
    req.body.endDate ||
    activeTab
  ) {
    if (
      selectVal === "phone" ||
      selectVal === "number" ||
      selectVal === "transactionId" ||
      selectVal === "_id"
    ) {
      if (selectVal !== "transactionId" && selectVal !== "number") {
        const FindUser = await Users.findOne({ [selectVal]: searchVal });
        if (FindUser) {
          allRecharges = await Recharge.find({ userId: FindUser._id })
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .populate("userId");

          LastPage = Math.ceil(
            (await Recharge.countDocuments({ userId: FindUser._id })) / pageSize
          );
        } else {
          res.status(400);
          throw new Error(`${selectVal} - ${searchVal} is Incorrect`);
        }
      } else {
        allRecharges = await Recharge.find({ [selectVal]: searchVal })
          .sort({ createdAt: -1 })
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .populate("userId");
        LastPage = Math.ceil(
          (await Recharge.countDocuments({ [selectVal]: searchVal })) / pageSize
        );
      }
    } else if (startDate && endDate && !activeTab) {
      allRecharges = await Recharge.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate("userId");

      LastPage = Math.ceil((await Recharge.countDocuments()) / pageSize);
    } else if (activeTab) {
      if (activeTab === "select") {
        allRecharges = await Recharge.find()
          .sort({ createdAt: -1 })
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .populate("userId");

        LastPage = Math.ceil((await Recharge.countDocuments()) / pageSize);
      } else {
        let statusValues;

        if (activeTab === "Failure") {
          statusValues = ["Failure", "Failed"];
        } else {
          statusValues = [activeTab];
        }

        allRecharges = await Recharge.find({ status: { $in: statusValues } })
          .sort({ createdAt: -1 })
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .populate("userId");

        LastPage = Math.ceil((await Recharge.countDocuments()) / pageSize);
      }
    }
  } else {
    allRecharges = await Recharge.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate("userId");

    LastPage = Math.ceil((await Recharge.countDocuments()) / pageSize);
  }

  // const hist = await Recharge.find().populate("userId");
  // success handler
  successHandler(req, res, {
    Remarks: "Fetch Recharge History",
    Data: {
      data: allRecharges,
      lastPage: LastPage,
    },
    // Data: encryptFunc(allRecharges),
  });
});

// recharge history
const dthHistory = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const hist = await DTH.find({ userId: _id }).sort({ createdAt: -1 });
  // success handler
  successHandler(req, res, {
    Remarks: "User DTH Recharge History",
    Data: hist,
  });
});

const fetchDthOperators = asyncHandler(async (req, res) => {
  // const { _id } = req.data;
  const operators = All_DTH_Recharge_Operator_List.filter(op => {
    return op.Billhub_Operator_code && op.Operator_name && op.img;
  })
  // success handler
  successHandler(req, res, {
    Remarks: "User DTH Operators",
    Data: operators,
  });
});

// recharge history by admin
const dthHistoryByAdmin = asyncHandler(async (req, res) => {
  const hist = await DTH.find().populate("userId");
  // success handler
  successHandler(req, res, {
    Remarks: "Fetch DTH Recharge History",
    Data: (hist.reverse()),
  });
});

// ----------- If recharge fail when initiate refund by admin ------------ //
const handleFailedRecharge = asyncHandler(async (req, res) => {
  const { rechargeId } = req.body;
  if (!rechargeId) {
    res.status(400);
    throw new Error("Please fill all fields");
  }
  const findRecharge = await Recharge.findOne({ _id: rechargeId });

  if (findRecharge.status === "Refunded") {
    res.status(400);
    throw new Error("Already refunded.");
  } else {
    if (findRecharge) {
      const findTxn = await Transaction.findOne({
        txnId: findRecharge.transactionId,
        userId: findRecharge.userId,
      });
      const userFound = await User.findById(findRecharge.userId);
      const findService = await Service.findById(findTxn?.serviceId);
      const percent =
        (findTxn.txnAmount / 100) *
        (findTxn.isUsePrime ? 25 : findService.percent);

      // update wallet
      await Wallet.updateOne(
        { userId: findRecharge.userId },
        {
          $inc: {
            balance: findTxn.txnAmount - percent,
            goPoints: findTxn.isUsePrime ? 0 : percent,
            primePoints: findTxn.isUsePrime ? percent : 0,
          },
        }
      );

      // Push notification
      const notification = {
        title: "Recharge Refund",
        body: `Your recharge refund ${findTxn.txnAmount} rupay is refunded into wallet.`,
      };
      // save notification
      const newNotification = new Notification({
        ...notification,
        recipient: findRecharge.userId,
      });
      await newNotification.save();
      userFound.deviceToken &&
        sendNotification(notification, userFound.deviceToken);

      // ----------- Create Txn History ------------- //
      const subtractBalance = new Transaction({
        userId: userFound._id,
        recipientId: userFound._id,
        txnName: "Recharge Refund",
        txnDesc: "Your recharge refund issued.",
        txnAmount: findTxn.txnAmount,
        txnType: "credit",
        txnStatus: "TXN_SUCCESS",
        txnResource: "Wallet",
        txnId: Math.floor(Math.random() * Date.now()) + "refund",
        orderId: Math.floor(Math.random() * Date.now()) + "refund",
        ipAddress: getIpAddress(req),
      });
      await subtractBalance.save(); // wallet balance history
      const subtractGoPoints = new Transaction({
        userId: userFound._id,
        recipientId: userFound._id,
        txnName: "Recharge Refund",
        txnDesc: "Your recharge refund issued.",
        txnType: "credit",
        txnStatus: "TXN_SUCCESS",
        txnResource: findTxn.isUsePrime ? "PrimePoints" : "GoPoints",
        txnId: Math.floor(Math.random() * Date.now()) + "refund",
        orderId: Math.floor(Math.random() * Date.now()) + "refund",
        txnAmount: percent,
        ipAddress: getIpAddress(req),
      });
      await subtractGoPoints.save(); // go points history

      await Recharge.updateOne({ _id: rechargeId }, { status: "Refunded" });
      successHandler(req, res, { Remarks: "Refund issued success" });
    } else {
      res.status(400);
      throw new Error("Please enter valid recharge id.");
    }
  }
});

const commission = asyncHandler(async (req, res) => {
  console.log("commission api called");
  return successHandler(req, res, {
    Remarks: "Commission fetched successfully",
    data: {
      mobile: {
        Airtel: {
          commission: 2.5,
          icon: "uploads/operator/airtel.jpg",
        },
        Jio: {
          commission: 3,
          icon: "uploads/operator/jio.jpg",
        },
        Vi: {
          commission: 4.5,
          icon: "uploads/operator/vi.jpg",
        },
        Bsnl: {
          commission: 5,
          icon: "uploads/operator/bsnl.jpg",
        },
      },
      dth: {
        Airtel: {
          icon: "uploads/operator/airtel.jpg",
          commission: 1,
        },
        "Sun Direct": {
          icon: "uploads/operator/sun_tv.jpg",
          commission: 1.5,
        },
        Videocon: {
          icon: "uploads/operator/videocon.jpg",
          commission: 1.2,
        },
        "Tata Sky": {
          icon: "uploads/operator/tata_sky.jpg",
          commission: 2.1,
        },
      },
      bbps: {
        Water: {
          icon: "uploads/services/water.png",
          commission: 3,
        },
        Gas: {
          icon: "uploads/services/Book-gas-cylinder-icon.png",
          commission: 3,
        },
        Electricity: {
          icon: "uploads/services/electricity-bill-icon.png",
          commission: 4,
        },
        Insurance: {
          icon: "uploads/services/insurance.png",
          commission: 3,
        },
        Postpaid: {
          icon: "uploads/services/postpaid.png",
          commission: 2,
        },
        "Fast Card": {
          icon: "uploads/services/fastag.png",
          commission: 2,
        },
        "Google Play": {
          icon: "uploads/services/google-play.png",
          commission: 2.12,
        },
      },
    },
  });
});

const handleRechargeStatusUpdate = async (TransID, Status) => {
  await Recharge.findOneAndUpdate(
    {
      transactionId: TransID,
    },
    { $set: { status: Status } }
  );
};


const handleBBPSStatusUpdate = async (TransID, Status) => {
  await BBPS.findOneAndUpdate(
    {
      transactionId: TransID,
    },
    { $set: { status: Status } }
  );
};


const handleRechargeSendNotification = async (
  findTxn,
  findRecord,
  userFound,
  Status
) => {
  const notification = {
    title: `Recharge ${Status}`,
    body: `Your ${findTxn.txnAmount} recharge is ${Status}`,
  };
  // save notification
  const newNotification = new Notification({
    ...notification,
    recipient: findRecord.userId,
  });
  await newNotification.save();
  // push notification
  userFound.deviceToken &&
    sendNotification(notification, userFound.deviceToken);
};


const handleBBPSSendNotification = async (
  findTxn,
  findBBPSRecord,
  userFound,
  Status
) => {
  const notification = {
    title: `Bill Payment ${Status}`,
    body: `Your ${findTxn.txnAmount} Payment is ${Status}`,
  };
  // save notification
  const newNotification = new Notification({
    ...notification,
    recipient: findBBPSRecord.userId,
  });
  await newNotification.save();
  // push notification
  userFound.deviceToken &&
    sendNotification(notification, userFound.deviceToken);
};


const handleDTHStatusUpdate = async (TransID, Status) => {
  await DTH.findOneAndUpdate(
    {
      transactionId: TransID,
    },
    { $set: { status: Status } }
  );
};


const handleDTHSendNotification = async (
  findTxn,
  findDTHRecord,
  userFound,
  Status
) => {
  const notification = {
    title: `DTH Recharge is ${Status}`,
    body: `Your â‚¹${findTxn.txnAmount} DTH Recharge is ${Status}`,
  };
  // save notification
  const newNotification = new Notification({
    ...notification,
    recipient: findDTHRecord.userId,
  });
  await newNotification.save();
  // push notification
  userFound.deviceToken &&
    sendNotification(notification, userFound.deviceToken);
};


const Recharge_CallBack_Handler = asyncHandler(async (req, res) => {
  try {
    console.log("-----------------------------")
    console.log("Recharge Callback Handler Invoked");
    if (req?.method) console.log("Request Method:", req.method);
    if (req?.body) console.log("Request Body:", req.body);
    if (req?.query) console.log("Request Query:", req.query);
    if (req?.params) console.log("Params:", req.params);
    console.log("-----------------------------")
    
    let Status;
    let TransID;
    let provider = "UNKNOWN"; // Track which provider sent the webhook

    // Determine provider based on request data
    if (req.method === "POST") {
      // Check for EZTYM format
      if (req.body.STATUS !== undefined || req.body.OPTRANSID !== undefined) {
        provider = "EZTYM";
        Status = req.body.STATUS || 0;
        // Map EZTYM status codes
        if (Status === 1) Status = "success";
        else if (Status === 3) Status = "failed";
        else Status = "pending";
        TransID = req.body.Member_request_txnid || req.body.order_id || 0;
      } 
      // Check for BILLHUB format
      else if (req.body.status !== undefined || req.body.order_id !== undefined) {
        provider = "BILLHUB";
        Status = req.body.status?.toLowerCase() || 0;
        TransID = req.body.order_id || 0;
      }
      // Fallback
      else {
        Status = req.body.Status || req.body.status || 0;
        TransID = req.body.order_id || 0;
      }

      // Log raw data for debugging
      console.log("Logging webhook data to file");
      const logFile = path.join(process.cwd(), "webhook_logs.txt");
      console.log("Logging to file:", logFile);
      fs.appendFileSync(logFile, `${new Date().toISOString()} - ${provider} - ${req.method} - ${JSON.stringify(req.body)}\n`);
      console.log("Logged webhook data successfully");
    } else if (req.method === "GET") {
      console.log("Processing GET request");
      
      // Check for EZTYM GET format
      if (req.query.STATUS !== undefined || req.query.OPTRANSID !== undefined) {
        provider = "EZTYM";
        Status = req.query.STATUS || 0;
        Status = Status === "1" ? "success" : Status === "3" ? "failed" : Status;
        TransID = req.query.txnid || req.query.order_id;
      }
      // Check for BILLHUB GET format
      else if (req.query.status !== undefined || req.query.order_id !== undefined) {
        provider = "BILLHUB";
        Status = req.query.status?.toLowerCase() || 0;
        TransID = req.query.order_id;
      }
      // Fallback
      else {
        Status = req.query.Status || req.query.status || req.query.STATUS;
        Status = Status === "1" ? "success" : Status === "3" ? "failed" : Status;
        TransID = req.query.TransID || req.query.txnid || req.query.txid || req.query.RRR || req.query.order_id;
      }
      
      console.log("Parsed Status:", Status, "Provider:", provider);

      // Log raw data for debugging
      const logFile = path.join(process.cwd(), "webhook_logs.txt");
      console.log("Logging to file:", logFile);
      fs.appendFileSync(logFile, `${new Date().toISOString()} - ${provider} - ${req.method} - ${JSON.stringify(req.query)}\n`);
      console.log("Logged webhook data successfully");
    }

    if (!Status || !TransID) {
      return res.status(400).json({ 
        error: "Missing parameters",
        received: { 
          status: Status, 
          transactionId: TransID,
          provider: provider,
          body: req.body,
          query: req.query 
        }
      });
    }

    console.log(`Processing webhook from ${provider}: Status=${Status}, TransID=${TransID}`);

    // Check for Recharge record
    const findRecord = await Recharge.findOne({
      transactionId: TransID,
    });

    if (findRecord) {
      const findTxn = await Transaction.findOne({
        txnId: findRecord.transactionId,
        userId: findRecord.userId,
      });

      const findService = await Service.findById(findTxn?.serviceId);
      const userFound = await User.findById(findRecord.userId);
      const walletFound = await Wallet.findOne({ userId: userFound._id });

      // Determine API URLs based on provider
      let apiUrl;
      let callbackUrl;
      
      if (provider === "EZTYM") {
        apiUrl = "https://api.roboticexchange.in/Robotics/webservice/GetMobileRecharge";
        callbackUrl = "https://api.karl.techember.in/api/webhook/callback";
      } else if (provider === "BILLHUB") {
        apiUrl = "https://api.techember.in/app/recharges/main.php";
        callbackUrl = "https://production-api.google.info/api/wallet/callback";
      } else {
        // Fallback based on record provider
        if (findRecord.provider === "EZTYM") {
          apiUrl = "https://api.roboticexchange.in/Robotics/webservice/GetMobileRecharge";
          callbackUrl = "https://api.karl.techember.in/api/webhook/callback";
        } else {
          apiUrl = "https://api.techember.in/app/recharges/main.php";
          callbackUrl = "https://production-api.google.info/api/wallet/callback";
        }
      }

      if (
        (Status.toLowerCase() === "failed" || Status.toLowerCase() === "failure") &&
        (findRecord.status.toLowerCase() === "pending" || findRecord.status.toLowerCase() === "error")
      ) {
        await saveLog(
          `MOBILE_RECHARGE_${provider}`,
          apiUrl,
          callbackUrl,
          req.body || req.query,
          `Recharge Callback Status Update from ${provider}: ${Status} for TxnID: ${TransID}`
        );
        await handleRechargeStatusUpdate(TransID, Status);

        // Send Notification for Failed Recharge
        await handleRechargeSendNotification(findTxn, findRecord, userFound, Status);

        // Refund Amount
        await handleRefund(userFound, findTxn.txnAmount, TransID, getIpAddress(req), walletFound);

        console.log(`Recharge Failed via ${provider}, Refund Processed`);
        res.status(200).send("Callback processed successfully");
      } else if (
        Status.toLowerCase() === "success" &&
        (findRecord.status.toLowerCase() === "pending" || findRecord.status.toLowerCase() === "error")
      ) {
        await saveLog(
          `MOBILE_RECHARGE_${provider}`,
          apiUrl,
          callbackUrl,
          req.body || req.query,
          `Recharge Callback Status Update from ${provider}: ${Status} for TxnID: ${TransID}`
        );
        await handleRechargeStatusUpdate(TransID, Status);

        // Send Notification for Success Recharge
        await handleRechargeSendNotification(findTxn, findRecord, userFound, Status);

        // Handle Cashback based on provider
        let cashbackAmount = 0;
        
        if (provider === "EZTYM" || findRecord.provider === "EZTYM") {
          // EZTYM cashback logic (using RechargeOperator)
          const findRechargeOperator = await RechargeOperator.findOne({
            serviceId: findService._id,
          });
          
          if (findRechargeOperator) {
            let findPercent;
            const operatorMapping = {
              2: findRechargeOperator.airtel,
              11: findRechargeOperator.jio,
              23: findRechargeOperator.vi,
              4: findRechargeOperator.bsnl,
            };
            findPercent = operatorMapping[findRecord.operator] || 0;
            cashbackAmount = (parseInt(findTxn.txnAmount) / 100) * findPercent;
            console.log(`EZTYM Cashback: ${cashbackAmount} (${findPercent}%)`);
          }
        } else {
          // BILLHUB cashback logic (using Commission)
          const findOperator = All_Recharge_Operator_List.find(
            (a) => a.PlanApi_Operator_code == findTxn?.operator
          );

          const op = findOperator?.com_name;
          console.log("Operator for Cashback:", op);
          
          const commission = await Commission.findOne({ 
            name: op, 
            status: true 
          });
          
          if (commission) {
            let cashbackPercent = commission.commission || 0;
            console.log("Cashback Percent:", cashbackPercent);
            
            if (commission.symbol === "%") {
              cashbackAmount = (findTxn.txnAmount / 100) * cashbackPercent;
            } else if (commission.symbol === "₹") {
              cashbackAmount = cashbackPercent;
            }
            console.log("Calculated Cashback Amount:", cashbackAmount);
          }
        }

        // Apply cashback if amount > 0
        if (cashbackAmount > 0 && findRecord.isPrepaid) {
          await handleCashback(
            userFound,
            cashbackAmount,
            TransID,
            getIpAddress(req),
            walletFound
          );
          console.log(`Cashback of ${cashbackAmount} applied via ${provider}`);
        }

        res.status(200).send("Callback processed successfully");
      } else if (
        (Status.toLowerCase() === "failed" || Status.toLowerCase() === "failure") &&
        findRecord.status.toLowerCase() === "success"
      ) {
        await handleRechargeStatusUpdate(TransID, Status);
        await handleRechargeSendNotification(findTxn, findRecord, userFound, Status);
        
        const findCashbackTxn = await Transaction.findOne({
          txnId: `${findRecord.transactionId}cashback`,
          userId: findRecord.userId,
        });

        // Handle Dispute Refund
        await handleDisputeRefund(
          userFound,
          findTxn,
          findCashbackTxn,
          TransID,
          getIpAddress(req),
          walletFound
        );
        
        console.log(`Dispute refund processed via ${provider}`);
        res.status(200).send("Callback processed successfully");
      } else {
        console.log(`No valid action needed for ${provider} webhook`);
        res.status(200).json("No Valid Action");
      }
    } else {
      // Handle BBPS and DTH records (unchanged from your second code)
      const findBBPSRecord = await BBPS.findOne({
        transactionId: TransID,
      });

      if (findBBPSRecord) {
        const findTxn = await Transaction.findOne({
          txnId: findBBPSRecord.transactionId,
          userId: findBBPSRecord.userId,
        });
        const findService = await Service.findById(findTxn?.serviceId);
        const percent = (findTxn.txnAmount / 100) * findService.percent;
        const userFound = await User.findById(findBBPSRecord.userId);
        const walletFound = await Wallet.findOne({ userId: userFound._id });

        if (
          (Status.toLowerCase() === "failed" || Status.toLowerCase() === "failure") &&
          findBBPSRecord.status.toLowerCase() === "pending"
        ) {
          await saveLog(
            `BILL_PAYMENT`,
            findBBPSRecord.provider === "Billhub" 
              ? "https://api.billhub.in/reseller/recharge" 
              : "https://business.a1topup.com/recharge/api",
            "https://production-api.google.info/api/wallet/callback",
            req.body || req.query,
            `Recharge Callback Status Update: ${Status} for TxnID: ${TransID}`
          );
          await handleBBPSStatusUpdate(TransID, Status);
          await handleBBPSSendNotification(findTxn, findBBPSRecord, userFound, Status);
          await handleRefund(userFound, findTxn.txnAmount, TransID, getIpAddress(req), walletFound);
          res.status(200).send("Callback processed successfully");
        } else if (
          Status.toLowerCase() === "success" &&
          findBBPSRecord.status.toLowerCase() === "pending"
        ) {
          await saveLog(
            `BILL_PAYMENT`,
            findBBPSRecord.provider === "Billhub" 
              ? "https://api.billhub.in/reseller/recharge" 
              : "https://business.a1topup.com/recharge/api",
            "https://production-api.google.info/api/wallet/callback",
            req.body || req.query,
            `Recharge Callback Status Update: ${Status} for TxnID: ${TransID}`
          );
          
          if (findBBPSRecord.operator === "GLF") {
            await BBPS.findOneAndUpdate(
              { transactionId: TransID },
              { $set: { status: Status, operatorRef: req.query.opid } }
            );
          } else {
            await handleBBPSStatusUpdate(TransID, Status);
          }
          
          await handleBBPSSendNotification(findTxn, findBBPSRecord, userFound, Status);
          
          // Cashback logic for BBPS
          const cashback = await Commission.findOne({
            serviceId: findService._id,
            status: true
          });
          
          let cashbackAmount = 0;
          if (cashback) {
            const findValue = cashback.commission || 0;
            if (cashback.symbol === "%") {
              cashbackAmount = (findTxn.txnAmount / 100) * findValue;
            } else if (cashback.symbol === "₹") {
              cashbackAmount = findValue;
            }
            cashbackAmount = parseFloat(cashbackAmount.toFixed(2));
          }
          
          if (cashbackAmount > 0) {
            await handleCashback(userFound, cashbackAmount, TransID, getIpAddress(req), walletFound);
          }
          
          res.status(200).send("Callback processed successfully");
        } else {
          return res.status(400).json({ error: "No Valid Action" });
        }
      } else {
        const findDTHRecord = await DTH.findOne({
          transactionId: TransID,
        });

        if (findDTHRecord) {
          const findTxn = await Transaction.findOne({
            txnId: findDTHRecord.transactionId,
            userId: findDTHRecord.userId,
          });
          const findService = await Service.findById(findTxn?.serviceId);
          const userFound = await User.findById(findDTHRecord.userId);
          const walletFound = await Wallet.findOne({ userId: userFound._id });
          
          if (
            (Status.toLowerCase() === "failed" || Status.toLowerCase() === "failure") &&
            findDTHRecord.status.toLowerCase() === "pending"
          ) {
            await handleDTHStatusUpdate(TransID, Status);
            await handleDTHSendNotification(findTxn, findDTHRecord, userFound, Status);
            await handleRefund(userFound, findTxn.txnAmount, TransID, getIpAddress(req), walletFound);
            res.status(200).send("Callback processed successfully");
          } else if (
            Status.toLowerCase() === "success" &&
            findDTHRecord.status.toLowerCase() === "pending"
          ) {
            await handleDTHStatusUpdate(TransID, Status);
            await handleDTHSendNotification(findTxn, findDTHRecord, userFound, Status);
            
            // Cashback for DTH
            const cashback = await Commission.findOne({
              serviceId: findService._id,
              status: true
            });
            
            let cashbackAmount = 0;
            if (cashback) {
              const findValue = cashback.commission || 0;
              if (cashback.symbol === "%") {
                cashbackAmount = (findTxn.txnAmount / 100) * findValue;
              } else if (cashback.symbol === "₹") {
                cashbackAmount = findValue;
              }
              cashbackAmount = parseFloat(cashbackAmount.toFixed(2));
            }
            
            if (cashbackAmount > 0) {
              await handleCashback(userFound, cashbackAmount, TransID, getIpAddress(req), walletFound);
            }
            
            res.status(200).send("Callback processed successfully");
          } else {
            return res.status(400).json({ error: "No Valid Action" });
          }
        }

        return res.status(400).json({ 
          error: "Invalid TxnID",
          transactionId: TransID,
          provider: provider
        });
      }
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(400);
    throw new Error(error.message);
  }
});


const Get_Recharge_Operator_Percent = asyncHandler(async (req, res) => {
  try {
    const findOperator = await RechargeOperator.findOne();
    res.status(200).send(findOperator);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const Recharge_Status_Verify = asyncHandler(async (req, res) => {
  try {
    const { order_id } = req.query;
    try {
      // const URL = `https://api.billhub.in/reseller/status/?token=${process.env.BILLHUB_TOKEN}&order_id=${order_id}`;
      console.log("order id", order_id);
      const URL = `https://api.techember.in/app/check-status.php?token=${process.env.BILLHUB_TOKEN}&order_id=${order_id}`;
      await saveLog(
        "MOBILE_RECHARGE_STATUS",
        "https://api.techember.in/app/check-status.php",
        URL, // or full request payload
        null,
        `Recharge Status initiated for TxnID: ${order_id}`
      );

      const response = await axios.get(URL);
      console.log("row response", response.data);
      await saveLog(
        "MOBILE_RECHARGE_STATUS",
        "https://api.techember.in/app/check-status.php",
        URL, // or full request payload
        response.data,
        `Recharge Status Response for TxnID: ${order_id}, Status : ${response.data.status}`
      );

      if (!response.data || !response.data.status) {
        res.status(400);
        throw new Error("Failed to fetch status from billhub.");
      }

      const payload = {
        order_id: order_id,
        status: response.data.status,
      };

      const resP = await axios.post(
        `https://api.new.techember.in/api/wallet/callback`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      res.status(200).json({ message: resP.data });
    } catch (error) {
      if (
        error.response &&
        error.response.status === 404 &&
        error.response.data.message == "Transaction does not exist"
      ) {
        const payload = {
          order_id: order_id,
          status: "failed",
        };

        const resP = await axios.post(
          `https://api.new.techember.in/api/wallet/callback`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
        res.status(200).json({ message: resP.data });
      } else {
        res.status(400);
        throw new Error(error.message);
      }
    }
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

const Recharge_All_Status_Verify = asyncHandler(async (req, res) => {
  try {
    // Fetch all pending records from the database
    const pendingRecords = await Recharge.find({ status: "pending" });

    if (!pendingRecords.length) {
      return res.status(200).json({ message: "No pending records found." });
    }

    // Process each record based on the provider
    const results = await Promise.allSettled(
      pendingRecords.map(async (record) => {
        try {
          let apiResponse;

          // Determine the API to call based on the provider
          if (record.provider.toLowerCase() === "billhub") {
            try {
              apiResponse = await axios.get(
                `https://api.billhub.in/reseller/status/?token=${process.env.BILLHUB_TOKEN}&order_id=${record.transactionId}`
              );

              if (!apiResponse.data || !apiResponse.data.status) {
                res.status(400);
                throw new Error("Failed to fetch status from a1topup.");
              }

              const payload = {
                order_id: record.transactionId,
                status: apiResponse.data.status?.toLowerCase(),
              };

              const resP = await axios.post(
                `https://production-api.google.info/api/wallet/callback`,
                payload,
                { headers: { "Content-Type": "application/json" } }
              );
              res.status(200).json({ message: resP.data });
            } catch (error) {
              if (
                error.response &&
                error.response.status === 404 &&
                error.response.data.message == "Transaction does not exist"
              ) {
                const payload = {
                  order_id: order_id,
                  status: "failed",
                };

                const resP = await axios.post(
                  `https://production-api.google.info/api/wallet/callback`,
                  payload,
                  { headers: { "Content-Type": "application/json" } }
                );
                res.status(200).json({ message: resP.data });
              } else {
                res.status(400);
                throw new Error(error.message);
              }
            }
          } else if (
            record.provider.toLowerCase() === "a1topup" ||
            record.provider.toLowerCase() === "a1 topup"
          ) {
            apiResponse = await axios.get(
              `https://business.a1topup.com/recharge/status?username=${process.env.A1_TOPUP_USERNAME}&pwd=123&orderid=${record.transactionId}&format=json`
            );

            if (!apiResponse.data || !apiResponse.data.status) {
              res.status(400);
              throw new Error("Failed to fetch status from a1topup.");
            }

            try {
              const payload = {
                order_id: record.transactionId,
                status: apiResponse.data.status?.toLowerCase(),
              };

              const resP = await axios.post(
                `https://production-api.google.info/api/wallet/callback`,
                payload,
                { headers: { "Content-Type": "application/json" } }
              );
              res.status(200).json({ message: resP.data });
            } catch (error) {
              res.status(400);
              throw new Error(error.message);
            }
          } else {
            throw new Error(`Unknown provider: ${record.provider}`);
          }

          // Update record status
          record.status = apiResponse.data.status;
          await record.save();

          return { recordId: record.id, status: "success" };
        } catch (error) {
          console.error(`Error verifying record ${record.id}:`, error.message);
          return {
            recordId: record.id,
            status: "failed",
            error: error.message,
          };
        }
      })
    );

    return res
      .status(200)
      .json({ message: "Verification completed.", results });
  } catch (error) {
    console.error("Error processing pending records:", error.message);
    res.status(500).json({
      message: "Failed to verify pending records.",
      error: error.message,
    });
  }
});

const Update_Recharge_Commission = asyncHandler(async (req, res) => {
  const { percentages } = req.body;

  // Validate the input
  if (!percentages || typeof percentages !== "object") {
    res.status(400);
    throw new Error("Percentages object is required.");
  }

  // Prepare allowed operators
  const allowedOperators = ["airtel", "vi", "jio", "bsnl"];
  const updateFields = {};

  // Validate and filter the input
  for (const [operator, percentage] of Object.entries(percentages)) {
    if (!allowedOperators.includes(operator)) {
      res.status(400);
      throw new Error(`Invalid operator: ${operator}`);
    }
    updateFields[operator] = percentage;
  }

  if (Object.keys(updateFields).length === 0) {
    res.status(400);
    throw new Error("No valid operators provided for update.");
  }

  // Perform the update
  const result = await RechargeOperator.updateMany({}, { $set: updateFields });

  if (result.matchedCount === 0) {
    res.status(404);
    throw new Error("No RechargeOperator records found.");
  }

  res.status(200).json({
    message: "Operator percentages updated successfully",
  });
});

const CHECK_STATUS_API = async (apiTransID, provider) => {
  // Call actual API here

  if (provider === "Billhub") {
    try {
      const URL = `https://api.billhub.in/reseller/status/?token=${process.env.BILLHUB_TOKEN}&order_id=${apiTransID}`;

      const response = await axios.get(URL);

      if (!response.data || !response.data.status) {
        throw new Error("Failed to fetch status from billhub.");
      }

      return {
        status: response.data.status?.toLowerCase(), // or "FAILED", or "PENDING"
        operatorRef: response.data.operatorrefno, // optional
      };
    } catch (error) {
      throw new Error(error.message);
    }
  } else if (provider === "A1Topup") {
    try {
      const URL = `https://business.a1topup.com/recharge/status?username=${process.env.A1_TOPUP_USERNAME}&pwd=123&orderid=${apiTransID}&format=json`;

      const response = await axios.get(URL);

      if (!response.data || !response.data.status) {
        throw new Error("Failed to fetch status from a1topup.");
      }

      return {
        status: response.data.status?.toLowerCase(), // or "FAILED", or "PENDING"
        operatorRef: response.data.operatorrefno, // optional
      };
    } catch (error) {
      throw new Error(error.message);
    }
  } else if (provider === "Mobikwik") {
    // console.log("Mobikwik Called");
    try {
      const URL = `https://${process.env.MOBIKWIK_HOSTNAME}/rechargeStatus.do?uid=${process.env.MOBIKWIK_UID}&pwd=${process.env.MOBIKWIK_PASSWORD}&txId=${apiTransID}`;

      const Mobiresponse = await axios.get(URL);

      const response = await parseXMLToJSON(Mobiresponse.data, "txStatus");
      // console.log(response, "response");

      const status =
        (response.status === "RECHARGESUCCESSPENDING" && "pending") ||
        (response.status === "RECHARGESUCCESS" && "success") ||
        (response.status === "RECHARGEFAILURE" && "failed");
      return {
        status: status, // or "FAILED", or "PENDING"
        operatorRef: response.operatorrefno, // optional
      };
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

const CHECK_PENDING_TRANSACTION = async () => {
  const fiveMinsAgo = moment().subtract(5, "minutes").toDate();

  const collections = [
    { model: Recharge, name: "Recharge" },
    { model: DTH, name: "DTH" },
    { model: BBPS, name: "BBPS" },
  ];

  for (const { model, name } of collections) {
    try {
      const pendingRecords = await model.find({
        status: "pending",
        $or: [{ lastCheckedAt: null }, { lastCheckedAt: { $lt: fiveMinsAgo } }],
      });

      for (const record of pendingRecords) {
        // console.log(record, "record");
        const response = await CHECK_STATUS_API(
          record.apiTransID,
          record.provider
        );

        await model.findByIdAndUpdate(record._id, {
          status: response.status,
          operatorRef: response.operatorRef || record.operatorRef,
          lastCheckedAt: new Date(),
        });
      }

      // console.log(`[${name}] Checked ${pendingRecords.length} pending records`);
    } catch (error) {
      console.error(`[${name}] Error:`, error.message);
    }
  }
};

const DTHOperatorArr = [
  {
    OperatorCode: "DTV",
    OperatorName: "Dish TV",
  },
  {
    OperatorCode: "TTV",
    OperatorName: "Tata Sky",
  },
  {
    OperatorCode: "VTV",
    OperatorName: "Videocon DTH",
  },
  {
    OperatorCode: "STV",
    OperatorName: "Sun Direct",
  },
  {
    OperatorCode: "ATV",
    OperatorName: "Airtel Digital TV",
  },
];

const userReferralList = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const user = await User.findById(_id).select("referalId");
  if (!user) {
    res.status(404);
    throw new Error("Unable to find user");
  }
  const refUser = await User.find({ referedBy: user.referalId });
  successHandler(req, res, {
    Remark: "User Referral List Fetched Successfully",
    Data: refUser.length ? refUser : [],
  })
})


const circles = [
  { id: 1, name: "DELHI", circleCode: "10" },
  { id: 2, name: "UP(West)", circleCode: "97" },
  { id: 3, name: "PUNJAB", circleCode: "02" },
  { id: 4, name: "HP", circleCode: "03" },
  { id: 5, name: "HARYANA", circleCode: "96" },
  { id: 6, name: "J&K", circleCode: "55" },
  { id: 7, name: "UP(East)", circleCode: "54" },
  { id: 8, name: "MUMBAI", circleCode: "92" },
  { id: 9, name: "MAHARASHTRA", circleCode: "90" },
  { id: 10, name: "GUJARAT", circleCode: "98" },
  { id: 11, name: "MP", circleCode: "93" },
  { id: 12, name: "RAJASTHAN", circleCode: "70" },
  { id: 13, name: "KOLKATTA", circleCode: "31" },
  { id: 14, name: "West Bengal", circleCode: "51" },
  { id: 15, name: "ORISSA", circleCode: "53" },
  { id: 16, name: "ASSAM", circleCode: "56" },
  { id: 17, name: "NESA", circleCode: "16" },
  { id: 18, name: "BIHAR", circleCode: "52" },
  { id: 19, name: "KARNATAKA", circleCode: "06" },
  { id: 20, name: "CHENNAI", circleCode: "40" },
  { id: 21, name: "TAMIL NADU", circleCode: "94" },
  { id: 22, name: "KERALA", circleCode: "95" },
  { id: 23, name: "AP", circleCode: "49" },
  { id: 24, name: "SIKKIM", circleCode: "99" },
  { id: 25, name: "TRIPURA", circleCode: "100" },
  { id: 26, name: "CHHATISGARH", circleCode: "101" },
  { id: 27, name: "GOA", circleCode: "102" },
  { id: 28, name: "MEGHALAY", circleCode: "103" },
  { id: 29, name: "MIZZORAM", circleCode: "104" },
  { id: 30, name: "JHARKHAND", circleCode: "105" }
];

const operators = [
  {
    id: 1, name: "Jio", operatorCode: 11,
    icon: "/uploads/operator/jio.jpg"
  },
  {
    id: 2, name: "Airtel", operatorCode: 2,
    icon: "/uploads/operator/airtel.jpg"
  },
  {
    id: 3, name: "VI", operatorCode: 23,
    icon: "/uploads/operator/vi.jpg"
  },
  {
    id: 4, name: "BSNL", operatorCode: 4,
    icon: "/uploads/operator/bsnl.jpg"
  },
];

const getCircleAndOperators = asyncHandler(async (req, res) => {
  successHandler(req, res, {
    Remarks: "Circle & Operator List",
    Data: {
      circles,
      operators
    }
  });
});

const lastRecharge = asyncHandler(async (req, res) => {
  const { _id: userId } = req.data;
  const { type, subType } = req.query;

  const allowedTypes = ["DTH", "Recharge", "BBPS"];

  const bbpsTypes = [
    "Gas", "Fastag", "LPG", "Postpaid", "Education Fee", "EMI",
    "Housing", "Hospital Bills", "Subscription", "Club Assoc",
    "Electricity", "Municipality", "Insurance", "Water", "Cable", "Broadband",
    "Landline", "Google Play"
  ];

  // ---------------- VALIDATE TYPE ----------------
  if (!allowedTypes.includes(type)) {
    res.status(400);
    throw new Error("Invalid recharge type");
  }

  // ---------------- VALIDATE BBPS SUBTYPE ----------------
  if (type === "BBPS") {
    if (!subType || !bbpsTypes.includes(subType)) {
      res.status(400);
      throw new Error("Invalid BBPS sub category");
    }
  }

  // ---------------- CHECK USER ----------------
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  let rechargeData = [];

  // ---------------- RECHARGE ----------------
  if (type === "Recharge") {
    rechargeData = await Recharge.find({
      userId,
      status: "success",
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

  // ---------------- DTH ----------------
  } else if (type === "DTH") {
    rechargeData = await DTH.find({
      userId,
      status: "success",
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

  // ---------------- BBPS ----------------
  } else if (type === "BBPS") {
    console.log("sub type", subType);
    const service = await Service.findOne({
      name: subType,
      // status: true, // ✅ FIXED (BOOLEAN)
    }).lean();

    if (!service) {
      res.status(404);
      throw new Error("BBPS service not found");
    }

    rechargeData = await BBPS.find({
      userId,
      serviceId: service._id,
      status: "success",
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
  }

  return successHandler(req, res, {
    Remark: "Last 5 recharges fetched successfully",
    Data: rechargeData,
  });
});




module.exports = {
  planFetch, //-----------------------------
  userReferralList,
  lastRecharge,
  //   getOperator, //-----------------------------
  //   getCircle, //-----------------------------
  //   getBalance, //-----------------------------
  rechargeRequest, //-----------------------------
  //   rechargeStatus, //-----------------------------
  //   dthInfoFetch, //-----------------------------
  fetchDthPlans,
  fetchDthOperator,
  rechargeHistory,
  dthRequest,
  dthHistory,
  handleFailedRecharge,
  rechargeHistoryByAdmin,
  dthHistoryByAdmin,
  Recharge_CallBack_Handler, // isko karna hai
  Get_Operator_Circle_By_Phone, //-----------------------------
  Get_Recharge_Operator_Percent,
  BillhubComplainRaise,
  Recharge_Status_Verify,
  Recharge_All_Status_Verify,
  Update_Recharge_Commission,
  CHECK_PENDING_TRANSACTION,
  rechargeStatus,
  fetchDthOperators,
  commission,
  fetchDthOpDetails,
  getCircleAndOperators,
};

// 
