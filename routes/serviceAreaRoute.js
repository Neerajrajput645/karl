const { adminTokenVerify } = require("../common/tokenVerify");
const {
  getServiceArea,
  createServiceArea,
  checkServiceArea,
  deleteServiceArea,
  updateServiceArea,
} = require("../controllers/serviceArea");

const router = require("express").Router();

router.route("/check").post(checkServiceArea);
router.delete("/:pinCodeId", adminTokenVerify, deleteServiceArea);
router
  .route("/")
  .get(getServiceArea)
  .post(adminTokenVerify, createServiceArea)
  .put(adminTokenVerify, updateServiceArea);

module.exports = router;
