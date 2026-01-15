const termCondition = require("../../models/newModels/termCondition");
const asyncHandler = require("express-async-handler");
const successHandler = require("../../common/successHandler");
const validMongooseId = require("../../common/new/mongoIDvalidation");

const createTermCondition = asyncHandler(async (req, res) => {
    // console.log("Request Body:", req.body); // Debugging line to check the request body
    const { title, content } = req.body;
    const newTermCondition = new termCondition({ title, content });
    await newTermCondition.save();
   return successHandler(req, res, {
    remark: "Term condition created successfully",
    data: null,
  });
});


const getAllTermCondition = asyncHandler(async (req, res) => {
    
    const termConditionData = await termCondition.find({status:true}).sort({ createdAt: -1 });
    successHandler(req, res, {
      remark: "Term conditions fetched successfully",
      data: termConditionData,
    });
});


const getAllTermConditionAdmin = asyncHandler(async (req, res) => {
    const termConditionData = await termCondition.find().sort({ createdAt: -1 });
    successHandler(req, res, {
      remark: "Term conditions fetched successfully",
      data: termConditionData,
    });
});


const updateTermCondition = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, content, status } = req.body;
    const response = await termCondition.findById(id);
    if (!response) {
        res.status(404);
        throw new Error("Term condition not found");
    }
    response.title = title || response.title;
    response.content = content || response.content;
    response.status = status !== undefined ? status : response.status;
    response.updatedAt = Date.now();
    await response.save();
    return successHandler(req, res, {
        remark: "Term condition updated successfully",
        data: null,
    });
});


const deleteTermCondition = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(res,id);
    const response = await termCondition.findByIdAndDelete(id);
    if (!response) {
        res.status(404);
        throw new Error("Term condition not found");
    }
    successHandler(req, res, {
        remark: "Term condition deleted successfully",
        data: null,
    });
});


module.exports = {
    createTermCondition,
    getAllTermCondition,
    getAllTermConditionAdmin,
    updateTermCondition,
    deleteTermCondition
};