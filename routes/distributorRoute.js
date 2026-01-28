const router = require("express").Router();
const { tokenVerify } = require("../common/tokenVerify");
const {
  createRetailer,
  getMyRetailers,
  getMyEarnings,
  getEarningsSummary,
  getCommissionRates,
} = require("../controllers/distributor");

// Middleware to check if user is a distributor
const isDistributor = async (req, res, next) => {
  if (req.data?.userType !== "Distributor") {
    return res.status(403).json({
      Error: true,
      Status: false,
      ResponseStatus: 0,
      StatusCode: "Ex403",
      Remarks: "Access denied. Only distributors can access this resource.",
    });
  }
  next();
};

// ========================= Distributor Routes =========================
router.post("/create-retailer", tokenVerify, isDistributor, createRetailer);
router.get("/my-retailers", tokenVerify, isDistributor, getMyRetailers);
router.get("/my-earnings", tokenVerify, isDistributor, getMyEarnings);
router.get("/earnings-summary", tokenVerify, isDistributor, getEarningsSummary);
router.get("/commission-rates", tokenVerify, isDistributor, getCommissionRates);

module.exports = router;
