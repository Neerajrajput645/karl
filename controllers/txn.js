const Txn = require("../models/txnSchema");
const asyncHandler = require("express-async-handler");
const successHandler = require("../common/successHandler");
const rechargeSchema = require("../models/service/rechargeSchema");
const dthSchema = require("../models/service/dthSchema");
const bbps = require("../models/service/bbps");
const {
  All_Recharge_Operator_List,
  All_DTH_Recharge_Operator_List,
} = require("../utils/MockData");
const userSchema = require("../models/userSchema");


// =============== Get Transaction List with Filters ==============
const getTransaction = asyncHandler(async (req, res) => {
  try {
    const bills = [
      "Electricity",
      "FasTag",
      "Landline",
      "LPG",
      "Education Fee",
      "Loan Repay",
      "Credit Card",
      "Housing",
      "Hospital Bills",
      "Subscription",
      "Club Assoc",
      "Tax",
      "Municipal Ser",
      "Insurance",
    ];

    const { _id } = req.data;

    // Extract all possible filters
    const {
      txnResource,
      txnType,
      txnName,
      status,
      search,
      fromDate,
      toDate,
      page = 1,
      limit = 20,
    } = req.query;

    // Base filter
    const filter = { userId: _id };

    // Apply optional filters (only if provided)
    if (txnResource) filter.txnResource = txnResource;

    if (txnType) filter.txnType = txnType; // debit / credit

    allTxn = await Txn.find({ userId: _id }).populate("recipientId");
    const allTxnResource = allTxn.map((item) => item.txnName);
    // console.log("req.query", allTxnResource);

    if (status) filter.status = status; // success / failed / pending

    if (txnName) {
      filter.txnName =
        txnName === "Bills" ? { $in: bills } : txnName;
    }

    // Search filter (on amount, reference, recipient name, etc.)
    if (search) {
      filter.$or = [
        { amount: { $regex: search, $options: "i" } },
        { referenceId: { $regex: search, $options: "i" } },
        { "recipientName": { $regex: search, $options: "i" } },
      ];
    }

    // Date range filter
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch data
    const transactions = await Txn.find(filter)
      .populate("recipientId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Txn.countDocuments(filter);
    // console.log("Total Transactions Found:", total);
    successHandler(req, res, {
      Remarks: "Filtered transaction list",
      Data: {
        total,
        page: Number(page),
        limit: Number(limit),
        transactions,
      },
    });
  } catch (err) {
    res.status(500).json({
      Error: true,
      Status: false,
      ResponseStatus: 0,
      StatusCode: "Ex500",
      Remarks: err.message || "Something went wrong",
    });
  }
});

// =============== Get All Transactions (Admin) ==============
const getAllTransaction = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, sort = "-createdAt", fromDate, toDate } = req.query;

  page = Number(page);
  limit = Number(limit);

  // Build condition object from query
  const condition = { ...req.query };
  delete condition.page;
  delete condition.limit;
  delete condition.sort;
  delete condition.fromDate;
  delete condition.toDate;

  // -------- DATE FILTERING --------
  if (fromDate || toDate) {
    condition.createdAt = {};
    if (fromDate) {
      condition.createdAt.$gte = new Date(fromDate + "T00:00:00.000Z");
    }
    if (toDate) {
      condition.createdAt.$lte = new Date(toDate + "T23:59:59.999Z");
    }
  }
  // --------------------------------

  const skip = (page - 1) * limit;

  // Fetch transactions with pagination
  const txnList = await Txn.find(condition)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate("userId", "firstName lastName phone");

  // Count total documents
  const totalCount = await Txn.countDocuments(condition);

  successHandler(req, res, {
    Remarks: "Fetch all transactions",
    Data: {
      data: txnList,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    },
  });
});

// =============== Get Transactions by User ID ==============
const txnByUserId = asyncHandler(async (req, res) => {
  const receiverId = req.params.receiverId;
  console.log("Fetching transactions for receiverId:", receiverId);

  const txnsRaw = await Txn.find({
    $or: [
      { userId: receiverId },
      { recipientId: receiverId },
      { "recipientId._id": receiverId }
    ]
  })
    .select("-__v -gatewayName -ipAddress")
    .populate("userId", "firstName lastName email phone")
    .populate("recipientId", "firstName lastName email phone");

  // sort old → new for balance calculation
  let txns = txnsRaw.sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  let currentBalance = 0;

  txns = txns.map((txn) => {
    const amount = Number(txn.txnAmount) || 0;
    let openingBalance = currentBalance;
    let closingBalance = currentBalance;

    // ✅ Only wallet transactions affect balance
    if (txn.txnResource !== "Online") {
      if (txn.txnType === "credit") {
        currentBalance += amount;
      } else {
        currentBalance -= amount;
      }
      closingBalance = currentBalance;
    }

    return {
      ...txn._doc,
      openingBalance: openingBalance.toFixed(2),
      closingBalance: closingBalance.toFixed(2),
    };
  });

  // latest first
  txns.reverse();

  successHandler(req, res, {
    Remarks: "Fetch all wallet transactions of user.",
    Data: txns,
  });
});


// =============== Generate Ledger Report for User ==============
const GET_LEDGER_REPORT_USER = asyncHandler(async (req, res) => {
  const { phone, startDate, endDate } = req.query;
  if (!phone) {
    res.status(400);
    throw new Error("Parameter is Missing");
  }
  try {
    const user = await userSchema
      .findOne({ phone: phone })
      .select("firstName lastName");
    console.log(user, "user");
    const fullName = `${user.firstName.trim()} ${user.lastName.trim()}`;

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // ✨ Date Filter (Optional)
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    // Step 1: Fetch Wallet Transactions
    const walletTransactions = await Txn.find({
      userId: user._id,
      ...dateFilter,
    });

    // Step 2: Fetch Service-Specific Transactions
    const rechargeTransactions = await rechargeSchema.find({
      userId: user._id,
      ...dateFilter,
    });
    const dthTransactions = await dthSchema.find({
      userId: user._id,
      ...dateFilter,
    });
    const bbpsTransactions = await bbps.find({
      userId: user._id,
      ...dateFilter,
    });

    // Step 3: Combine All Transactions
    let allTransactions = [];

    console.log(walletTransactions, "walletTransactions");
    // Handle Wallet Transactions (Avoid Duplicates)
    walletTransactions.forEach((txn) => {
      let description = txn.txnDesc;
      // Avoid duplicate entry based on txnId
      // console.log(txn.txnId, "txn.txnId");
      if (!allTransactions.some((t) => t.orderId === txn.txnId)) {
        const findRecharge = rechargeTransactions.find(
          (a) => a.transactionId == txn.txnId
        );
        const findDTH = dthTransactions.find(
          (a) => a.transactionId == txn.txnId
        );
        const findBBPS = bbpsTransactions.find(
          (a) => a.transactionId == txn.txnId
        );
        // console.log("findRecharge 3",findRecharge);
        if (findRecharge) {
          const findOpr = All_Recharge_Operator_List.find(
            (b) =>
              b.PlanApi_Operator_code == findRecharge.operator ||
              b.A1_Operator_code == findRecharge.operator ||
              b.Cyrus_Operator_code == findRecharge.operator ||
              b.Billhub_Operator_code == findRecharge.operator
          );
        
          description = `Mobile Recharge | ${findRecharge.number} | ${findOpr.Operator_name} | TXN_ID ${txn.txnId}`;
          // console.log(dec, "findOpr");
        } else if (findDTH) {
          const findOpr = All_DTH_Recharge_Operator_List.find(
            (b) =>
              b.Billhub_Operator_code == findDTH.operator ||
              b.Mobikwik_Operator_code == findDTH.operator ||
              b.A1_Operator_code == findDTH.operator
          );
          description = `DTH Recharge | ${findDTH.number} | ${findOpr.Operator_name} | TXN_ID ${txn.txnId}`;
        } else if (findBBPS) {
          description = `Bill Payment | ${findBBPS.number} | ${findBBPS.operator} | TXN_ID ${txn.txnId}`;
        } else if (txn.txnId.endsWith("cashback")) {
          description = `${txn.txnDesc} | TXN_ID ${txn.txnId.replace(
            /(cashback)$/,
            ""
          )}`;
        } else if (txn.txnId.endsWith("refund")) {
          description = `${txn.txnDesc} | TXN_ID ${txn.txnId.replace(
            /(refund)$/,
            ""
          )}`;
        } else if (txn.txnDesc == "You have added to wallet.") {
          description = `WALLET_TOPUP`;
        }
        allTransactions.push({
          orderId: txn.txnId,
          description,
          type: txn.txnType, // credit/debit
          amount: txn.txnAmount,
          linkedOrderId: txn.txnId.endsWith("cashback")
            ? txn.txnId.replace("cashback", "")
            : txn.txnId.endsWith("refer")
              ? txn.txnId.replace("refer", "")
              : txn.txnId.endsWith("refund")
                ? txn.txnId.replace("refund", "")
                : null,
          status: txn.txnStatus,
          date: txn.createdAt,
        });
      }
    });

   

    // Handle Recharge Transactions (Add Service Remarks and Avoid Duplicates)
    rechargeTransactions.forEach((txn) => {
      const existingTxn = allTransactions.find(
        (t) => t.orderId === txn.transactionId
      );
      if (!existingTxn) {
        allTransactions.push({
          orderId: txn.transactionId,
          description: `Recharge (${txn.operator})`,
          type: "debit",
          amount: txn.amount,
          linkedOrderId: null,
          status: txn.status,
          date: txn.createdAt,
        });
      }
    });

    // Handle BBPS Transactions (Add Service Remarks and Avoid Duplicates)
    bbpsTransactions.forEach((txn) => {
      const existingTxn = allTransactions.find(
        (t) => t.orderId === txn.transactionId
      );
      if (!existingTxn) {
        allTransactions.push({
          orderId: txn.transactionId,
          description: `BBPS Payment to ${txn.operator}`,
          type: "debit",
          amount: txn.amount,
          linkedOrderId: null,
          status: txn.status,
          date: txn.createdAt,
        });
      }
    });

    // Handle DTH Transactions (Add Service Remarks and Avoid Duplicates)
    dthTransactions.forEach((txn) => {
      const existingTxn = allTransactions.find(
        (t) => t.orderId === txn.transactionId
      );
      if (!existingTxn) {
        allTransactions.push({
          orderId: txn.transactionId,
          description: `DTH Recharge to ${txn.operator}`,
          type: "debit",
          amount: txn.amount,
          linkedOrderId: null,
          status: txn.status,
          date: txn.createdAt,
        });
      }
    });

    // Step 4: Sort Transactions by Date
    allTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Step 5: Calculate Opening and Closing Balances
    let openingBalance = 0;
    const ledger = allTransactions.map((txn) => {
      const closingBalance =
        txn.type === "credit"
          ? openingBalance + txn.amount
          : openingBalance - txn.amount;

      const ledgerEntry = {
        orderId: txn.orderId,
        description: txn.description,
        debit: txn.type === "debit" ? txn.amount : 0,
        credit: txn.type === "credit" ? txn.amount : 0,
        openingBalance: openingBalance.toFixed(2),
        closingBalance: closingBalance.toFixed(2),
        date: txn.date,
        userName: fullName, // Add User Name in Ledger
      };

      openingBalance = closingBalance;
      return ledgerEntry;
    });
    successHandler(req, res, {
      Remarks: "Ledger Generate Successfully",
      Data: ledger,
    });
  } catch (error) {
    console.error("Error generating ledger:", error);
    throw new Error("Failed to generate ledger.");
  }
});



module.exports = {
  getTransaction,
  txnByUserId,
  getAllTransaction,
  GET_LEDGER_REPORT_USER,
};
