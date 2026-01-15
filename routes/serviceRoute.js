const router = require("express").Router();
const { serviceUpload } = require("../common/fileUpload");
const { adminTokenVerify } = require("../common/tokenVerify");
const {
  serviceList,
  addService,
  updateService,
  deleteService,
} = require("../controllers/service");

// ========================= Service Routes ==========================
router.get("/list", serviceList);
router.delete("/:serviceId", adminTokenVerify, deleteService);
router.post("/create",adminTokenVerify,serviceUpload.single("icon"),addService);
router.patch("/:serviceId",adminTokenVerify,serviceUpload.single("icon"),updateService);

module.exports = router;
