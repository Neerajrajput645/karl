const RefundPolicy = require("../../models/newModels/refundPolicy");
const asyncHandler = require("express-async-handler");
const successHandler = require("../../common/successHandler");
const validMongooseId = require("../../common/new/mongoIDvalidation");

const createRefundPolicy = asyncHandler(async (req, res) => {
    console.log("Request Body:", req.body); // Debugging line to check the request body
    const { title, content } = req.body;
    const newRefundPolicy = new RefundPolicy({ title, content });
    await newRefundPolicy.save();
   return successHandler(req, res, {
    remark: "Refund policy created successfully",
    data: null,
  });
});

const getAllRefundPolicy = asyncHandler(async (req, res) => {

    const refundPolicy = await RefundPolicy.find({status:true}).sort({ createdAt: -1 });
    successHandler(req, res, {
      remark: "Refund policy fetched successfully",
      data: refundPolicy,
    });
});

const getAllRefundPolicyAdmin = asyncHandler(async (req, res) => {
    const refundPolicy = await RefundPolicy.find().sort({ createdAt: -1 });
    successHandler(req, res, {
      remark: "Refund policy fetched successfully",
      data: refundPolicy,
    });
});

const updateRefundPolicy = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // console.log("Updating Refund Policy ID:", id); // Debugging line to check the ID
    // validMongooseId(id);
    const { title, content,status } = req.body;
    const response = await RefundPolicy.findById(id);
    if (!response) {
      res.status(404);
      throw new Error("Refund policy not found");
    }
    response.title = title || response.title;
    response.content = content || response.content;
    response.status = status !== undefined ? status : response.status;
    response.updatedAt = Date.now();
    await response.save();
    return successHandler(req, res, {
      remark: "Privacy policy updated successfully",
      data: null,
    });
});

const deleteRefundPolicy = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(res,id);
    const response = await RefundPolicy.findByIdAndDelete(id);
    // console.log("Deleted Refund Policy:", response); // Debugging line to check the deleted document
    if (!response) {
        res.status(404);
        throw new Error("Refund policy not found");
    }
    successHandler(req, res, {
      remark: "Refund policy deleted successfully",
      data: null,
    });
});

module.exports = {
    createRefundPolicy,
    getAllRefundPolicy,
    updateRefundPolicy,
    deleteRefundPolicy,
    getAllRefundPolicyAdmin
};

