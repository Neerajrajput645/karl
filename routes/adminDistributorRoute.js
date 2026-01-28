const router = require("express").Router();
const { adminTokenVerify } = require("../common/tokenVerify");
const {
  createDistributor,
  getAllDistributors,
  getDistributorRetailers,
  setDistributorCommission,
  getDistributorCommissions,
  getDistributorEarnings,
  deleteDistributorCommission,
  toggleCommissionStatus,
  setGlobalCommission,
} = require("../controllers/adminDistributor");

// ========================= Admin Distributor Routes =========================
router.post("/create", adminTokenVerify, createDistributor);
router.get("/list", adminTokenVerify, getAllDistributors);
router.get("/retailers/:distributorId", adminTokenVerify, getDistributorRetailers);
router.post("/set-commission", adminTokenVerify, setDistributorCommission);
router.get("/commissions/:distributorId", adminTokenVerify, getDistributorCommissions);
router.get("/earnings/:distributorId", adminTokenVerify, getDistributorEarnings);
router.delete("/commission/:commissionId", adminTokenVerify, deleteDistributorCommission);
router.patch("/commission/:commissionId/toggle-status", adminTokenVerify, toggleCommissionStatus);
router.post("/set-global-commission", adminTokenVerify, setGlobalCommission);

module.exports = router;
