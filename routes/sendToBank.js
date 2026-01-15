const router = require("express").Router();
const { adminTokenVerify, tokenVerify } = require("../common/tokenVerify");
const {
  createRequest,
  allRequests,
  userRequests,
  actionRequest,
} = require("../controllers/sendToBank");

router.post("/", tokenVerify, createRequest);
router.get("/list", adminTokenVerify, allRequests);
router.get("/", tokenVerify, userRequests);
router.put("/:requestId", adminTokenVerify, actionRequest);

module.exports = router;
