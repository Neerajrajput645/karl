const aboutUs = require("../../models/newModels/aboutUs");
const asyncHandler = require("express-async-handler");
const successHandler = require("../../common/successHandler");
const validMongooseId = require("../../common/new/mongoIDvalidation");

const createAboutUs = asyncHandler(async (req, res) => {
    // console.log("Request Body:", req.body); // Debugging line to check the request body
    const { title, content } = req.body;
    const newAboutUs = new aboutUs({ title, content });
    await newAboutUs.save();
   return successHandler(req, res, {
    remark: "About Us created successfully",
    data: null,
  });
});


const getAllAboutUs = asyncHandler(async (req, res) => {

    const aboutUsData = await aboutUs.find({status:true}).sort({ createdAt: 1 });
    successHandler(req, res, {
      remark: "About Us fetched successfully",
      data: aboutUsData,
    });
});


const getAllAboutUsAdmin = asyncHandler(async (req, res) => {
    const aboutUsData = await aboutUs.find().sort({ createdAt: 1 });
    successHandler(req, res, {
      remark: "About Us fetched successfully",
      data: aboutUsData,
    });
});


const updateAboutUs = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, content, status } = req.body;
    const response = await aboutUs.findById(id);
    if (!response) {
        res.status(404);
        throw new Error("About Us not found");
    }
    response.title = title || response.title;
    response.content = content || response.content;
    response.status = status !== undefined ? status : response.status;
    response.updatedAt = Date.now();
    await response.save();
    return successHandler(req, res, {
        remark: "About Us updated successfully",
        data: null,
    });
});


const deleteAboutUs = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validMongooseId(res,id);
    const response = await aboutUs.findByIdAndDelete(id);
    if (!response) {
        res.status(404);
        throw new Error("About Us not found");
    }
    successHandler(req, res, {
        remark: "About Us deleted successfully",
        data: null,
    });
});


module.exports = {
    createAboutUs,
    getAllAboutUs,
    getAllAboutUsAdmin,
    updateAboutUs,
    deleteAboutUs
};