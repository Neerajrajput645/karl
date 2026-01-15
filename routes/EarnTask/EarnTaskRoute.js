const { adminTokenVerify, tokenVerify } = require("../../common/tokenVerify");
const {
  createTask,
  getAllTask,
  AdminApproveTask,
  SubmitTaskbyUser,
  getAllSubmissionTask,
  getSubmissionByUser,
} = require("../../controllers/EarnTask/earnTaskController");

const router = require("express").Router();

router.post("/task-create", adminTokenVerify, createTask);
router.post("/task-submit-user", tokenVerify, SubmitTaskbyUser);
router.patch("/task-manage", adminTokenVerify, AdminApproveTask);
router.get("/task-list", getAllTask);
router.post("/task-submission-list", adminTokenVerify, getAllSubmissionTask);
router.get("/user-task-submission-list", tokenVerify, getSubmissionByUser);

module.exports = router;
