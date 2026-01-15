// controllers/commissionController.js
const asyncHandler = require("express-async-handler");
const Commission = require("../../models/newModels/commission");
const successHandler = require("../../common/successHandler");
const deletePreviousImage = require("../../common/deletePreviousImage");
const { profilePicResize } = require("../../common/imageResize");

// ===================== ADMIN: ADD COMMISSION ======================
const addCommission = asyncHandler(async (req, res) => {
  const commission = await Commission.create({
    ...req.body,
    icon: req?.file?.path,
  });
  console.log("req.body", req.body);
  successHandler(req, res, {
    Remarks: "Commission added successfully",
    Data: commission,
  });
});

//===================== ADMIN: UPDATE COMMISSION ======================
const updateCommission = asyncHandler(async (req, res) => {
  const { commissionId } = req.params;
  const found = await Commission.findById(commissionId);

  if (!found) {
    return res.status(400).json({
      Error: true,
      Status: false,
      ResponseStatus: 0,
      StatusCode: "Ex400",
      Remarks: "Invalid commission ID",
    });
  }
  if (req.file) {
    deletePreviousImage(found.icon);
  }
  const updated = await Commission.findByIdAndUpdate(
    commissionId,
    {
      ...req.body,
      icon: req.file ? req.file.path : found.icon,
    },
    { new: true }
  );

  successHandler(req, res, {
    Remarks: "Commission updated successfully",
    Data: updated,
  });
});

//===================== ADMIN: DELETE COMMISSION ======================
const deleteCommission = asyncHandler(async (req, res) => {
  const { commissionId } = req.params;

  const found = await Commission.findById(commissionId);
  if (!found) {
    return res.status(400).json({
      Error: true,
      Status: false,
      ResponseStatus: 0,
      StatusCode: "Ex400",
      Remarks: "Invalid commission ID",
    });
  }

  await Commission.findByIdAndDelete(commissionId);

  successHandler(req, res, {
    Remarks: "Commission removed successfully",
    Data: found,
  });
});

// ====================== Get Commission Symbol ======================
const getCommissionSymbol = (operatorType, name) => {
  // Google Play exception - now always %
  if (name === "Google Play") return "%";

  // Mobile & DTH now always %
  if (operatorType === "mobile" || operatorType === "dth") return "%";

  // Remaining all BBPS → ₹
  if (operatorType === "bbps") return "₹";

  // Fallback safety
  return "%";
};

// ====================== Commission List with symbols ======================
const commissionList = asyncHandler(async (req, res) => {
  const all = await Commission.find({ status: true })
    .lean()
    .populate("serviceId");

  const grouped = {
    mobile: {},
    dth: {},
    bbps: {},
  };

  all.forEach((c) => {
    // const symbol = getCommissionSymbol(c.operatorType, c.name);

    grouped[c.operatorType][c.name] = {
      _id: c._id,
      commission: c.commission,
      icon: c.icon,
      symbol : c.symbol
    };
  });

  successHandler(req, res, {
    Remarks: "Commission fetched successfully",
    data: grouped,
  });
});

// ====================== Admin Commission with symbols ======================
const adminCommission = asyncHandler(async (req, res) => {
  const all = await Commission.find().lean();

  const grouped = {
    mobile: {},
    dth: {},
    bbps: {},
  };

  all.forEach((c) => {
    

    grouped[c.operatorType][c.name] = {
      _id: c._id,
      commission: c.commission,
      icon: c.icon,
      status: c.status,
      symbol : c.symbol
    };
  });

  successHandler(req, res, {
    Remarks: "Commission fetched successfully",
    Data: grouped,
  });
});


module.exports = {
  addCommission,
  updateCommission,
  deleteCommission,
  commissionList,
  adminCommission,
};