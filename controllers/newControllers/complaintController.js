const Complaint = require("../../models/newModels/complaint");
const ServiceRequest = require("../../models/newModels/serviceRequest");
const User = require("../../models/userSchema");
const asyncHandler = require("express-async-handler");
const successHandler = require("../../common/successHandler");
const validMongooseId = require("../../common/new/mongoIDvalidation");


const createComplaint = asyncHandler(async (req, res) => {
    const { _id } = req.data;
    const { description } = req.body;
    if (!description) {
        res.status(400);
        throw new Error("Please provide a description for the complaint");
    }
    const user = await User.findOne({ _id, status: true }).lean();
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    const complaint = await Complaint.create({
        userId: _id,
        description,
        status: "PENDING",
    });
    return successHandler(req, res, {
        message: "Complaint created successfully",
        data: complaint,
    });
});

const updateComplaintStatus = asyncHandler(async (req, res) => {
    const { complaintId, status } = req.body;
    const validStatuses = ["PENDING", "RESOLVED", "REJECTED"];
    if (!complaintId || !status || !validStatuses.includes(status)) {
        res.status(400);
        throw new Error("Invalid complaint ID or status");
    }
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
        res.status(404);
        throw new Error("Complaint not found");
    }
    complaint.status = status;
    await complaint.save();
    return successHandler(req, res, {
        message: "Complaint status updated successfully",
        data: complaint,
    });
});

const listAllComplaints = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const complaints = await Complaint.find()
        .populate("userId", "name email")
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .lean();
    return successHandler(req, res, {
        message: "Complaints retrieved successfully",
        data: complaints,
    });
});

const userComplaintList = asyncHandler(async (req, res) => {
    const { _id } = req.data;
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const complaints = await Complaint
        .find({ userId: _id })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)

        .lean();
    return successHandler(req, res, {
        message: "User complaints retrieved successfully",
        data: complaints,
    });
});

const singleComplaint = asyncHandler(async (req, res) => {
    const { complaintId } = req.params;
    if (!complaintId) {
        res.status(400);
        throw new Error("Complaint ID is required");
    }   

    const complaint = await Complaint.findById(complaintId).lean();
    if (!complaint) {
        res.status(404);
        throw new Error("Complaint not found");
    }

    return successHandler(req, res, {
        message: "Complaint retrieved successfully",
        data: complaint,
    });
});

module.exports = { createComplaint, updateComplaintStatus, listAllComplaints, userComplaintList, singleComplaint };