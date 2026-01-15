const asyncHandler = require("express-async-handler");
const successHandler = require("../../common/successHandler");
const ServiceProvider = require("../../models/newModels/serviceProvider");
const Review = require("../../models/newModels/providerReview");
const User = require("../../models/userSchema");
const Service = require("../../models/newModels/services");
const validMongooseId = require("../../common/new/mongoIDvalidation");

// ======================================= Create Service Provider ===================================
const createServiceProvider = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const {
    // location,
    city,
    services,
  } = req.body;

  // Validate inputs
  if (
    //   !location ||
    //   typeof location.longitude !== "number" ||
    //   typeof location.latitude !== "number" ||
    !city ||
    !Array.isArray(services) ||
    services.length === 0
  ) {
    res.status(400);
    throw new Error("Please provide valid city and service IDs");
  }

  // check Entered city is valid not not
  // if (!cityData.includes(city)) {
  //   res.status(400);
  //   throw new Error("Invalid City");
  // }

  // Check if user exists
  const user = await User.findById(_id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check for existing provider record
  let provider = await ServiceProvider.findOne({ userId: _id });

  // If user was a provider but status is false → reactivate
  if (provider && provider.status === false) {
    provider.status = true;
    user.isServiceProvider = true;
    await Promise.all([user.save(), provider.save()]);

    return successHandler(req, res, {
      remark: "You are reactivated as a service provider",
    });
  }

  // If already active provider → reject
  if (provider && provider.status === true) {
    res.status(400);
    throw new Error("You are already a service provider");
  }

  for (serv of services) validMongooseId(res, serv);

  const validServices = await Service.find({
    _id: { $in: services },
    status: true,
  });

  if (validServices.length !== services.length) {
    res.status(400);
    throw new Error("Some provided services are invalid or inactive");
  }

  // Create provider profile
  await ServiceProvider.create({
    userId: _id,
    services,
    city,
    // location: {
    //   type: "Point",
    //   coordinates: [location.longitude, location.latitude],
    // },
    status: true,
  });

  user.isServiceProvider = true;
  await user.save();

  return successHandler(req, res, {
    remark: "You are registered as a service provider",
  });
});

// ================================== Service Providers List (Admin) =====================================
const serviceProviderList = asyncHandler(async (req, res) => {
  let { status, page = 1, limit = 10 } = req.query;

  page = Math.max(parseInt(page), 1);
  limit = Math.max(parseInt(limit), 1);
  const offset = (page - 1) * limit;

  // filter
  const filter = {};
  if (status === "true") filter.status = true;
  else if (status === "false") filter.status = false;

  const count = await ServiceProvider.countDocuments(filter);
  const providersList = await ServiceProvider.find(filter)
    .select("-__v")
    .populate("userId", "firstName")
    .skip(offset)
    .limit(limit);

  const totalPages = Math.ceil(count / limit);

  successHandler(req, res, {
    remark: providersList.length
      ? "Service provider list fetched successfully"
      : "Empty Service Provider list",
    data: {
      providersList,
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

// ================================== Service Provider Profile (User) ===================================
const serviceProviderProfile = asyncHandler(async (req, res) => {
  const { _id } = req.data;

  const provider = await ServiceProvider.findOne({ userId: _id })
    .select("-__v -createdAt -updatedAt")
    .populate("userId", "firstName lastName")
    .lean();
  if (!provider) {
    res.status(404);
    throw new Error("Provider profile not found");
  }

  return successHandler(req, res, {
    remark: "Profile fetched successfully",
    data: provider,
  });
});

// ==================================== Update Provider Profile ====================================
const updateProviderProfile = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const {
    // location,
    services,
    city,
    // , isOnline
  } = req.body;

  const provider = await ServiceProvider.findOne({ userId: _id });
  if (!provider) {
    res.status(404);
    throw new Error("Provider not found");
  }
  //Validate & update services
  if (services) {
    if (!Array.isArray(services) || services.length === 0) {
      res.status(400);
      throw new Error("Services should be a non-empty array");
    }

    for (serv of services) validMongooseId(res, serv);

    const validServices = await Service.find({
      _id: { $in: services },
      status: true,
    });

    if (validServices.length !== services.length) {
      res.status(400);
      throw new Error("Some services are invalid or inactive");
    }

    provider.services = services;
  }

  // check intered city is valid not not
  if (city) {
    // if (!cityData.includes(city)) {
    //   res.status(400);
    //   throw new Error("Invalid City");
    // }

    provider.city = city;
  }

  // //Validate & update location
  // if (location) {
  //   const { longitude, latitude } = location;

  //   if (
  //     typeof longitude !== "number" ||
  //     typeof latitude !== "number" ||
  //     isNaN(longitude) ||
  //     isNaN(latitude)
  //   ) {
  //     res.status(400);
  //     throw new Error("Invalid longitude, latitude");
  //   }

  //   provider.location = {
  //     type: "Point",
  //     coordinates: [longitude, latitude],
  //   };
  // }

  //Update online status
  // if (typeof isOnline === "boolean") {
  //   provider.isOnline = isOnline;
  // }

  await provider.save();

  return successHandler(req, res, {
    remark: "Profile updated successfully",
  });
});

// ==================================== Delete Provider Profile (Soft Delete) ====================================
const deactivateProviderProfile = asyncHandler(async (req, res) => {
  const { _id } = req.data;

  const [providerProfile, user] = await Promise.all([
    ServiceProvider.findOne({ userId: _id }),
    User.findById(_id),
  ]);

  if (!providerProfile) {
    res.status(404);
    throw new Error("Service provider profile not found");
  }

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // If already inactive, avoid unnecessary writes
  if (!providerProfile.status && !user.isServiceProvider) {
    return successHandler(req, res, {
      remark: "Service provider profile is already deactivated",
    });
  }

  providerProfile.status = false;
  user.isServiceProvider = false;

  await Promise.all([user.save(), providerProfile.save()]);

  return successHandler(req, res, {
    remark: "Service provider profile removed successfully",
  });
});

// ====================================== Provider by ID (admin) ==========================================
const providerById = asyncHandler(async (req, res) => {
  const providerId = validMongooseId(res, req.params?.providerId);
  let provider = await ServiceProvider.findOne({ _id: providerId })
    .populate("userId", "firstName lastName")
    .lean();

  if (!provider) {
    res.status(404);
    throw new Error("Service provider not found");
  }

  return successHandler(req, res, {
    remark: "Service provider found",
    data: provider,
  });
});

// ====================================== Provider All Reviews =====================================
const providersAllReview = asyncHandler(async (req, res) => {
  let providerId = validMongooseId(res, req.params?.providerId);
  let { page = 1, limit = 10 } = req.query;
  const filter = {
    providerId,
    status: true,
  };
  page = Math.max(parseInt(page), 1);
  limit = Math.max(parseInt(limit), 1);
  const offset = (page - 1) * limit;

  const provider = await ServiceProvider.findOne({ _id: providerId });
  if (!provider) {
    res.status(404);
    throw new Error("Service provider not found");
  }
  const count = await Review.countDocuments(filter);
  const reviews = await Review.find(filter)
    .populate("ratingBy", "firstName")
    .select("-__v ")
    .skip(offset)
    .limit(limit)
    .lean();

  const totalPages = Math.ceil(count / limit);

  return successHandler(req, res, {
    remark: reviews.length
      ? "Reviews fetched successfully"
      : "Empty review list",
    data: {
      reviews,
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

// ===================================== Export Controller ==========================================
module.exports = {
  createServiceProvider,
  serviceProviderList,
  serviceProviderProfile,
  updateProviderProfile,
  deactivateProviderProfile,
  providerById,
  providersAllReview,
};
