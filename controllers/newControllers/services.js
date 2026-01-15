const ServiceProvider = require("../../models/newModels/serviceProvider");
const asyncHandler = require("express-async-handler");
const successHandler = require("../../common/successHandler");
const deletePreviousImage = require("../../common/deletePreviousImage");
const Service = require("../../models/newModels/services");
const validMongooseId = require("../../common/new/mongoIDvalidation");
// =================================== Create Service ===================================
const createService = asyncHandler(async (req, res) => {
  let { name, description } = req.body;
  if (!name || !description || !req.file) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields",
    });
  }

  // Case-insensitive name check
  const existingService = await Service.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
  });

  if (existingService) {
    return res.status(400).json({
      success: false,
      message: "Service already exists with this name",
    });
  }

  const newService = new Service({
    name,
    description,
    image: req.file.path,
  });

  await newService.save();

  return successHandler(req, res, {
    remark: "Service created successfully",
    data: newService,
  });
});

// ================================ Service List (User) ===================================
const serviceList = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10 } = req.query;

  page = Math.max(parseInt(page), 1);
  limit = Math.max(parseInt(limit), 1);
  const offset = (page - 1) * limit;

  const filter = { status: true };
  const count = await Service.countDocuments(filter);
  const servicesList = await Service.find(filter)
    .select("-__v -createdAt -updatedAt -status")
    .sort({ name: 1 })
    .skip(offset)
    .limit(limit)
    .lean();

  const totalPages = Math.ceil(count / limit);
  successHandler(req, res, {
    remark: servicesList.length
      ? "Service list fetched successfully"
      : "No services available",
    data: {
      servicesList,
      pagination: {
        total: count,
        totalPages,
        currentPage: page,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
  });
});

// ================================ Service List (Admin) ===================================
const serviceListAdmin = asyncHandler(async (req, res) => {
  let { status, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (status === "true") filter.status = true;
  else if (status === "false") filter.status = false;

  page = Math.max(parseInt(page), 1);
  limit = Math.max(parseInt(limit), 1);
  const offset = (page - 1) * limit;

  const count = await Service.countDocuments(filter);
  const servicesList = await Service.find(filter)
    .sort({ name: 1 })
    .skip(offset)
    .limit(limit)
    .lean();

  const totalPages = Math.ceil(count / limit);
  successHandler(req, res, {
    remark: servicesList.length
      ? "Service list fetched successfully"
      : "No services available",
    data: {
      servicesList,
      pagination: {
        total: count,
        totalPages,
        currentPage: page,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
  });
});

// ================================ Service By ID ===================================
const serviceById = asyncHandler(async (req, res) => {
  const id = validMongooseId(res, req?.params?.id);
  const serviceData = await Service.findById(id).select("-__v");

  if (!serviceData) {
    return res.status(404).json({
      success: false,
      message: "Service not found",
    });
  }

  return successHandler(req, res, {
    remark: "Service fetched successfully",
    data: serviceData,
  });
});

// ================================ Update Service ===================================
const updateService = asyncHandler(async (req, res) => {
  const id = validMongooseId(res, req?.params?.id);
  const { name, description } = req.body;

  if (!name && !description && !req.file) {
    res.status(400);
    throw new Error("At least one field is required to update");
  }

  const serviceData = await Service.findById(id);
  if (!serviceData) {
    res.status(404);
    throw new Error("Service not found");
  }

  if (name?.trim() && name.trim() !== serviceData.name) {
    const nameExists = await Service.findOne({
      name: name.trim(),
      _id: { $ne: id },
    });
    if (nameExists) {
      res.status(400);
      throw new Error("Another service already exists with this name");
    }
    serviceData.name = name.trim();
  }

  if (description?.trim()) serviceData.description = description.trim();

  let oldImage = null;
  if (req.file) {
    oldImage = serviceData.image;
    serviceData.image = req.file.path;
  }

  await serviceData.save();

  if (oldImage) deletePreviousImage(oldImage);

  successHandler(req, res, {
    remark: "Service updated successfully",
  });
});

// ================================ Delete Service ===================================
const deleteService = asyncHandler(async (req, res) => {
  const id = validMongooseId(res, req?.params?.id);
  const serviceData = await Service.findById(id);
  if (!serviceData) {
    res.status(404);
    throw new Error("Service not found");
  }

  const image = serviceData.image;
  await serviceData.deleteOne();

  if (image) deletePreviousImage(image);

  successHandler(req, res, {
    remark: "Service deleted successfully",
  });
});

// ============================= get service provider by user id ============================
const getProviderServices = asyncHandler(async (req, res) => {
  const providerId = validMongooseId(res, req?.params?.providerId);

  // Fetch provider with service references
  const provider = await ServiceProvider.findById(providerId).populate(
    "services"
  );
  if (!provider) {
    return res.status(404).json({
      success: false,
      message: "Service provider not found",
    });
  }

  return successHandler(req, res, {
    remark: "Provider's services fetched successfully",
    data: provider.services,
  });
});

module.exports = {
  createService,
  serviceList,
  serviceById,
  updateService,
  deleteService,
  serviceListAdmin,
  getProviderServices,
};
