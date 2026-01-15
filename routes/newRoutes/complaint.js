const router = require("express").Router();
const { createComplaint, updateComplaintStatus,
    listAllComplaints, userComplaintList, singleComplaint
} = require("../../controllers/newControllers/complaintController");
const { adminTokenVerify, tokenVerify } = require("../../common/tokenVerify");

router.post("/", tokenVerify, createComplaint);
router.put("/:complaintId/status", adminTokenVerify, updateComplaintStatus);
router.get("/", adminTokenVerify, listAllComplaints);
router.get("/user", tokenVerify, userComplaintList);
router.get("/:complaintId", tokenVerify, singleComplaint);
module.exports = router;