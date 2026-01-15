const router = require("express").Router();
const { adminTokenVerify, tokenVerify } = require("../../common/tokenVerify");
const {
  createServiceProvider,
  serviceProviderList,
  serviceProviderProfile,
  updateProviderProfile,
  deactivateProviderProfile,
  providerById,
  providersAllReview,
  // createReview
} = require("../../controllers/newControllers/serviceProvider");

//=========================== Routes =====================================
router.get("/profile", tokenVerify, serviceProviderProfile);
router.post("/", tokenVerify, createServiceProvider);
router.get("/", serviceProviderList);
router.get("/:providerId", providerById);
router.put("/profile", tokenVerify, updateProviderProfile);
router.delete("/deactivate", tokenVerify, deactivateProviderProfile);
router.get("/:providerId/reviews", tokenVerify, providersAllReview);
//dummy for testing
// router.post("/review", createReview);

// ============================= Export ===================================
module.exports = router;
