const router = require("express").Router();
const { adminTokenVerify } = require("../../common/tokenVerify");
const {
  createService,
  serviceList,
  serviceListAdmin,
  serviceById,
  updateService,
  deleteService,
  getProviderServices,
} = require("../../controllers/newControllers/services");
const { serviceImages } = require("../../common/fileUpload");


//========================== Private routes =================================
router.post(
  "/",
  adminTokenVerify,
  serviceImages.single("image"),
  createService
);
router.get("/admin", adminTokenVerify, serviceListAdmin);
router.put(
  "/:id",
  adminTokenVerify,
  serviceImages.single("image"),
  updateService
);
router.delete("/:id", adminTokenVerify, deleteService);

//=========================== Public Routes ===============================
router.get("/:providerId/services", getProviderServices); // place before service by id to avoid conflict

router.get("/", serviceList);
router.get("/:id", serviceById);

// ============================= Export ===================================
module.exports = router;
