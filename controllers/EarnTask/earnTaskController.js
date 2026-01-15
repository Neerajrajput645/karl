const asyncHandler = require("express-async-handler");
const taskSchema = require("../../models/EarnTask/taskSchema");
const userTaskSubmissionSchema = require("../../models/EarnTask/userTaskSubmissionSchema");
const walletSchema = require("../../models/walletSchema");
const txnSchema = require("../../models/txnSchema");
const { generateOrderId } = require("../../common/generateOrderId");
const getIpAddress = require("../../common/getIpAddress");
const notificationSchema = require("../../models/notificationSchema");
const sendNotification = require("../../common/sendNotification");
const successHandler = require("../../common/successHandler");

const createTask = asyncHandler(async (req, res) => {
  const task = new taskSchema(req.body);
  await task.save();
  res.status(201).json({ message: "Task created", task });
});
const getAllTask = asyncHandler(async (req, res) => {
  const tasks = await taskSchema.find({ isActive: true });
  res.json(tasks);
});
const getAllSubmissionTask = asyncHandler(async (req, res) => {
  const page = parseInt(req.body.pageNumber) || 1;
  const pageSize = parseInt(req.body.pageSize) || 20;
  let allSubmission;
  let lastPage;

  const query = {};

  allSubmission = await userTaskSubmissionSchema
    .find()
    .sort({ submittedAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .populate("userId", "firstName lastName phone")
    .populate("taskId", "title rewardAmount");

  const totalCount = await userTaskSubmissionSchema.countDocuments(query);
  lastPage = Math.ceil(totalCount / pageSize);

  successHandler(req, res, {
    Data: {
      allSubmission,
      lastPage,
    },
    Remarks: "Submission Fetch Successful.",
  });

  //   res.json({ submissions });
});

const getSubmissionByUser = asyncHandler(async (req, res) => {
  const submissions = await userTaskSubmissionSchema
    .find({ userId: req.data._id })
    .populate("taskId", "title rewardAmount slug")
    .sort({ submittedAt: -1 });

  if (!submissions || submissions.length === 0) {
    return res.status(404).json({ message: "No submissions found" });
  }

  res.json({ submissions });
});

const SubmitTaskbyUser = asyncHandler(async (req, res) => {
  const { taskId } = req.body;

  const task = await taskSchema.findById(taskId);
  console.log(task, "task");
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const submission = new userTaskSubmissionSchema({
    userId: req.data._id,
    taskId: task._id,
  });

  await submission.save();

  res.status(201).json({ message: "Task submitted successfully" });
});

const AdminApproveTask = asyncHandler(async (req, res) => {
  const { submissionId, status } = req.body; // action: 'approve' or 'reject'

  const submission = await userTaskSubmissionSchema
    .findById(submissionId)
    .populate("taskId userId");
  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  if (submission.status === "Approved" || submission.status === "Rejected") {
    return res.status(400).json({ message: "Submission already reviewed" });
  }

  const user = submission.userId;

  if (status === "Approved") {
    const rewardAmount = submission.taskId.rewardAmount;

    const wallet = await walletSchema.findOne({ userId: user._id });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    wallet.balance += rewardAmount;
    await wallet.save();

    submission.status = "Approved";
    submission.rewardCredited = true;
    submission.reviewedAt = new Date();
    await submission.save();
    const txnId = generateOrderId();

    const addrecord = new txnSchema({
      userId: user._id,
      recipientId: user._id,
      txnName: "Task Reward",
      txnDesc: `${submission.taskId.title}, Reward ₹${rewardAmount}, TXN_ID ${txnId}`,
      txnType: "credit",
      txnStatus: "TXN_SUCCESS",
      txnResource: "Wallet",
      txnId: txnId + "reward",
      orderId: txnId + "reward",
      txnAmount: rewardAmount,
      ipAddress: getIpAddress(req),
    });

    await addrecord.save();

    const notification = {
      title: "Task Reward Received",
      body: `${submission.taskId.title}, Hurray! 🎉 You got ₹${rewardAmount} as a Reward.`,
    };

    const newNotification = new notificationSchema({
      ...notification,
      recipient: user._id,
    });

    console.log(newNotification);

    await newNotification.save();

    // Send notification
    if (user?.deviceToken) {
      sendNotification(notification, user.deviceToken);
    }

    // Optional: sendNotification(user.deviceToken, `₹${rewardAmount} credited for completing task: ${submission.taskId.title}`);
    return res
      .status(200)
      .json({ message: "Submission approved and reward credited" });
  }

  if (status === "Rejected") {
    submission.status = "Rejected";
    submission.reviewedAt = new Date();
    await submission.save();

    // Optional: sendNotification(user.deviceToken, `Your submission for "${submission.taskId.title}" was rejected`);
    return res.status(200).json({ message: "Submission rejected" });
  }

  return res.status(400).json({ message: "Invalid action" });
});

module.exports = {
  createTask,
  getAllTask,
  SubmitTaskbyUser,
  AdminApproveTask,
  getAllSubmissionTask,
  getSubmissionByUser,
};
