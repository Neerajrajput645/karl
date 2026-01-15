const PrivacyPolicy = require("../../models/newModels/privacyPolicy");
const asyncHandler = require("express-async-handler");
const successHandler = require("../../common/successHandler");
const validMongooseId = require("../../common/new/mongoIDvalidation");

const createPrivacyPolicy = asyncHandler(async (req, res) => {
    console.log("Request Body:", req.body); // Debugging line to check the request body
    const { title, content } = req.body;
    const newPrivacyPolicy = new PrivacyPolicy({ title, content });
    await newPrivacyPolicy.save();
   return successHandler(req, res, {
    remark: "Privacy policy created successfully",
    data: null,
  });
});

const getAllPrivacyPolicy = asyncHandler(async (req, res) => {
    
    const privacyPolicy = await PrivacyPolicy.find({status:true}).sort({ createdAt: -1 });
    successHandler(req, res, {
      remark: "Privacy policy fetched successfully",
      data: privacyPolicy,
    });
});

const getAllPrivacyPolicyAdmin = asyncHandler(async (req, res) => {
    const privacyPolicy = await PrivacyPolicy.find().sort({ createdAt: -1 });
    successHandler(req, res, {
      remark: "Privacy policy fetched successfully",
      data: privacyPolicy,
    });
});

const updatePrivacyPolicy = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // console.log("Updating Privacy Policy ID:", id); // Debugging line to check the ID
    // validMongooseId(id);
    const { title, content,status } = req.body;
    const response = await PrivacyPolicy.findById(id);
    if (!response) {
      res.status(404);
      throw new Error("Privacy policy not found");
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

const deletePrivacyPolicy = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(res,id);
    const response = await PrivacyPolicy.findByIdAndDelete(id);
    // console.log("Deleted Privacy Policy:", response); // Debugging line to check the deleted document
    if (!response) {
        res.status(404);
        throw new Error("Privacy policy not found");
    }
    successHandler(req, res, {
      remark: "Privacy policy deleted successfully",
      data: null,
    });
});

module.exports = {
    createPrivacyPolicy,
    getAllPrivacyPolicy,
    updatePrivacyPolicy,
    deletePrivacyPolicy,
    getAllPrivacyPolicyAdmin
};

