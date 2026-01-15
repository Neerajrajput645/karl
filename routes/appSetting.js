const router = require("express").Router();
const { appLogoUpload } = require("../common/fileUpload");
const { adminTokenVerify } = require("../common/tokenVerify");
const {
  settingUpdate,
  settingGet,
  ADD_RECHARGE_API_PROVIDER,
  GET_RECHARGE_API_PROVIDER,
  SELECT_RECHARGE_API_PROVIDER,
  ADD_PLAN_API_PROVIDER,
  GET_PLAN_API_PROVIDER,
  SELECT_PLAN_API_PROVIDER,
} = require("../controllers/appSetting");

router.get("/", settingGet);
router.post("/add-api-provider", adminTokenVerify, ADD_RECHARGE_API_PROVIDER);
router.get("/api-provider", GET_RECHARGE_API_PROVIDER);
router.patch("/api-provider", adminTokenVerify, SELECT_RECHARGE_API_PROVIDER);
// Plan API Provider
router.post("/add-plan-api-provider", adminTokenVerify, ADD_PLAN_API_PROVIDER);
router.get("/api-plan-provider", GET_PLAN_API_PROVIDER);
router.patch("/api-plan-provider", adminTokenVerify, SELECT_PLAN_API_PROVIDER);
router.patch(
  "/",
  adminTokenVerify,
  appLogoUpload.single("logo"),
  settingUpdate
);

module.exports = router;
