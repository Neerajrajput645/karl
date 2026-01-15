const asyncHandler = require("express-async-handler");
const successHandler = require("../../common/successHandler");
const User = require("../../models/userSchema");
const Service = require("../../models/newModels/services");
const ServiceRequest = require("../../models/newModels/serviceRequest");
const ServiceProvider = require("../../models/newModels/serviceProvider");
const validMongooseId = require("../../common/new/mongoIDvalidation");
require("dotenv").config();

// Helper function for notifications
async function processNotifications(
  type,
  providers,
  user,
  service,
  request
) {
  const notificationPromises = providers.map(async (provider) => {
    const socketId = global.providerSockets[provider._id.toString()];

    if (socketId) {
      // Send via socket if online
      // console.log(socketId);
      // console.log("web socket notification send to ", provider)
      global.io.to(socketId).emit(type, request);
    } else {
      // Send push notification if offline
      // const providerProfile = await User.findById(provider.userId);
      // if (!providerProfile?.deviceToken) return;

      // const notification = {
      //   title: "New Service requested",
      //   body: `${user.firstName} wants ${service.name} service`,
      // };

      // await Notification.create({
      //   ...notification,
      //   recipient: providerProfile._id,
      // });

      // console.log("notification send to ", provider)
      // await sendNotification(notification, providerProfile.deviceToken); // uncomment in production
    }
  });

  await Promise.all(notificationPromises);
}


// ================================== Create Service Request ===================================
const createServiceRequest = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const {
    note,
    //  location,
    city,
    address,
  } = req.body;
  const serviceId = validMongooseId(res, req.body?.serviceId);

  // if (
  //   !location ||
  //   typeof location.longitude !== "number" ||
  //   typeof location.latitude !== "number"
  // ) {
  //   res.status(400);
  //   throw new Error("Invalid location values");
  // }

  // Check user status
  const user = await User.findOne({ _id, status: true });
  if (!user) {
    res.status(404);
    throw new Error("User not found or inactive");
  }

  // Check service status
  const service = await Service.findOne({ _id: serviceId, status: true });
  if (!service) {
    res.status(404);
    throw new Error("Service not found or inactive");
  }

  // Create service request
  // const coordinates = [location.longitude, location.latitude];
  const serviceRequest = new ServiceRequest({
    userId: _id,
    note,
    serviceId,
    address,
    // location: { type: "Point", coordinates },
    city,
    notifiedProviders: [],
  });

  // Find nearby providers and update notifiedProviders
  // const nearbyProviders = await ServiceProvider.find({
  //   // isOnline: true,
  //   location: {
  //     $near: {
  //       $geometry: { type: "Point", coordinates },
  //       $maxDistance: process.env.SERVICE_RADIUS,
  //     },
  //   },
  //   services: serviceId,
  // }).lean();

  const nearbyProviders = await ServiceProvider.find({ city, status: true });

  if (!nearbyProviders.length) {
    await serviceRequest.save();
    return successHandler(req, res, {
      remark: "Service request created but no nearby providers found",
      data: serviceRequest,
    });
  }

  // Store provider IDs who were notified
  const providerIds = nearbyProviders
    .filter((p) => p.userId.toString() !== user._id.toString())
    .map((p) => p._id);

  serviceRequest.notifiedProviders = providerIds;
  await serviceRequest.save();

  // Process notifications
  await processNotifications(
    "new-request",
    nearbyProviders,
    user,
    service,
    serviceRequest
  );

  successHandler(req, res, {
    remark: "Service request created successfully",
    data: serviceRequest,
  });
});

// ================================== all request list (with filter) admin ===================================
const allServiceRequestsList = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const userId = validMongooseId(res, req.query?.userId);
  let { page = 1, limit = 10 } = req.query;

  page = Math.max(parseInt(page), 1);
  limit = Math.max(parseInt(limit), 1);
  const offset = (page - 1) * limit;

  const data = ["PENDING", "PROGRESS", "COMPLETED", "CANCELED", "EXPIRED"];

  const conditions = {};
  if (status) if (data.includes(status)) conditions.status = status;
  if (userId) conditions.userId = userId;
  const count = await ServiceRequest.countDocuments(conditions);
  const serviceRequests = await ServiceRequest.find(conditions)
    .populate("serviceId", "name")
    .sort({ name: 1 })
    .skip(offset)
    .limit(limit)
    .lean();

  const totalPages = Math.ceil(count / limit);

  successHandler(req, res, {
    remark: serviceRequests.length
      ? "Service requests fetched successfully"
      : "Empty Service Request list",
    data: {
      serviceRequests,
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

// ==================================== provider's service request list (with status filter)==================================
const allProvidersRequest = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const { status } = req.query;

  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  page = Number.isNaN(page) || page < 1 ? 1 : page;
  limit = Number.isNaN(limit) || limit < 1 ? 10 : limit;

  const offset = (page - 1) * limit;

  const allowedStatuses = ["PENDING", "PROGRESS", "COMPLETED", "CANCELED", "EXPIRED"];
  if (status && !allowedStatuses.includes(status)) {
    return errorHandler(res, 400, "Invalid status value");
  }

  // Check user existence
  const user = await User.findOne({ _id, status: true });
  if (!user) {
    return errorHandler(res, 404, "User not found");
  }

  // Check provider existence
  const provider = await ServiceProvider.findOne({
    userId: user._id,
    status: true,
  });
  if (!provider) {
    return errorHandler(res, 404, "Provider not found");
  }

  // Build query filter
  const filter = {
    notifiedProviders: { $in: [provider._id] }, // ✅ FIXED
  };
  if (status) {
    filter.status = status;
  }

  // Get count and paginated requests
  const count = await ServiceRequest.countDocuments(filter);
  const totalPages = Math.ceil(count / limit);

  const requests = await ServiceRequest.find(filter)
    .select("-__v -createdAt -updatedAt -notifiedProviders")
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .lean();

  // Return paginated result
  return successHandler(req, res, {
    remark: "Provider's request list found",
    data: {
      requests,
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

// ================================== service Request list (user with status filter)==============================
const usersServiceRequestList = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const { status } = req.query;

  let { page = 1, limit = 10 } = req.query;

  page = Math.max(parseInt(page), 1);
  limit = Math.max(parseInt(limit), 1);
  const offset = (page - 1) * limit;

  const filter = { userId: _id };
  const data = ["PENDING", "PROGRESS", "COMPLETED", "CANCELED", "EXPIRED"];

  if (status) {
    if (data.includes(status)) filter.status = status;
  }

  const count = await ServiceRequest.countDocuments(filter);

  const serviceRequest = await ServiceRequest.find(filter)
    .select("-__v -createdAt -updatedAt -notifiedProviders")
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .lean();

  const totalPages = Math.ceil(count / limit);

  return successHandler(req, res, {
    remark: "User's service list found",
    data: {
      serviceRequest,
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

// i think there no use bacause provider can see service list in profile via profile API
// ==================================== Service List of Provider ===========================================
// const providerServiceList = asyncHandler(async (req, res) => {
//   const { _id } = req.data;
//   const { status } = req.query;

//   // Find the provider by userId
//   const provider = await ServiceProvider.findOne({
//     userId: _id,
//     status: true,
//   });

//   if (!provider) {
//     res.status(403);
//     throw new Error("Provider not found or inactive");
//   }

//   // Build the query
//   const query = {
//     notifiedProviders: provider._id,
//     $or: [{ providerId: null }, { providerId: provider._id }],
//   };

//   if (status) query.status = status;

//   const serviceRequest = await ServiceRequest.find(query).select(
//     "-__v -createdAt -updatedAt -notifiedProviders"
//   );

//   return successHandler(req, res, {
//     remark: "Provider's service list found",
//     data: serviceRequest,
//   });
// });

// ================================== Service Request Details (admin)-single  ===================================
const serviceRequestDetails = asyncHandler(async (req, res) => {
  const requestId = validMongooseId(res, req.params?.requestId);
  const serviceRequest = await ServiceRequest.findById(requestId)
    .populate("userId", "firstName phone")
    .populate("serviceId", "name")
    .populate({
      path: "providerId",
      populate: {
        path: "userId",
        select: "firstName",
      },
    })
    .lean();

  if (!serviceRequest) {
    res.status(404);
    throw new Error("Service request not found");
  }
  successHandler(req, res, {
    remark: "Service request fatch successfully",
    data: serviceRequest,
  });
});

// ================================== Service Request Details (user/provider)-single  ===================================
const serviceRequestById = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const serviceRequest = await ServiceRequest.findById(requestId)
    .populate("userId", "firstName phone")
    .populate("serviceId", "name")
    .select("-__v -status -createdAt -updatedAt -notifiedProviders")
    .populate({
      path: "providerId",
      populate: {
        path: "userId",
        select: "firstName",
      },
    });

  if (!serviceRequest) {
    res.status(404);
    throw new Error("Service request not found");
  }
  successHandler(req, res, {
    remark: "Service request fatch successfully",
    data: serviceRequest,
  });
});

// ================================== Accept request ================================================
const acceptRequest = asyncHandler(async (req, res) => {
  const { _id: providerId } = req.data;
  const requestId = validMongooseId(res, req.params?.requestId);
  // Find and validate request
  const serviceRequest = await ServiceRequest.findOne({
    _id: requestId,
    status: "PENDING",
    providerId: null,
  });

  if (!serviceRequest) {
    res.status(404);
    throw new Error("Service request not found or already assigned");
  }

  // Validate provider
  const provider = await ServiceProvider.findOne({
    userId: providerId,
    status: true,
    // isOnline:true
  }).populate("userId", "firstName phone");

  if (!provider) {
    res.status(403);
    throw new Error("Provider not found or inactive");
  }
  if (!serviceRequest.notifiedProviders.includes(provider.id)) {
    res.status(400);
    throw new Error("this task is not assign to you");
  }

  // Update request status
  serviceRequest.providerId = provider._id;
  serviceRequest.providerMobile = provider.userId.phone;
  serviceRequest.status = "PROGRESS";
  await serviceRequest.save();
  serviceRequest.notifiedProviders.push(serviceRequest.userId);
  serviceRequest.notifiedProviders.forEach((providerId) => {
    const socketId = global.providerSockets[providerId.toString()];
    if (provider.id !== providerId) {
      if (socketId) {
        console.log(socketId, "socket Id");
        global.io.to(socketId).emit("request-accepted", {
          requestId: serviceRequest._id,
          acceptedBy: provider.userId.firstName,
        });
      }
    }
  });

  return successHandler(req, res, {
    remark: "Service assigned successfully",
    data: {
      serviceRequestId: serviceRequest._id,
      assignedTo: provider.firstName,
    },
  });
});

// ================================== Decline request ================================================
const declineRequest = asyncHandler(async (req, res) => {
  const { _id: providerId } = req.data;
  const requestId = validMongooseId(res, req.params?.requestId);

  const findRequest = await ServiceRequest.findOne({
    _id: requestId,
    status: "PENDING",
    providerId: null,
  });

  if (!findRequest) {
    res.status(404);
    throw new Error("No active service request found");
  }

  const provider = await ServiceProvider.findOne({
    userId: providerId,
    status: true,
    // isOnline: true,
  });

  if (!provider) {
    res.status(403);
    throw new Error("Provider not found or inactive");
  }

  const providerObjectId = provider._id.toString();
  const notified = findRequest.notifiedProviders.map((id) => id.toString());

  if (!notified.includes(providerObjectId)) {
    res.status(400);
    throw new Error("You are not assigned to this request");
  }

  // Remove provider from notified list
  findRequest.notifiedProviders = findRequest.notifiedProviders.filter(
    (id) => id.toString() !== providerObjectId
  );

  // If no providers left, cancel request
  if (findRequest.notifiedProviders.length === 0) {
    findRequest.status = "CANCELED";
    findRequest.cancelReason = "No provider interested in your service";
  }

  await findRequest.save();

  return successHandler(req, res, {
    remark: "Request declined successfully",
    data: {
      requestId,
      declinedBy: providerId,
    },
  });
});

// ================================== compelete request ===================================
const completeRequest = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const requestId = validMongooseId(res, req.params?.requestId);

  const serviceRequest = await ServiceRequest.findOne({
    _id: requestId,
    userId: _id,
    status: "PROGRESS",
  });

  if (!serviceRequest) {
    res.status(404);
    throw new Error("No active service request found");
  }

  serviceRequest.status = "COMPLETED";
  await serviceRequest.save();

  const providerId = serviceRequest.providerId?.toString();
  if (providerId && global.providerSockets?.[providerId]) {
    const socketId = global.providerSockets[providerId];
    global.io.to(socketId).emit("request-complete", serviceRequest._id);
  }

  return successHandler(req, res, {
    remark: "Request completed successfully",
    requestId: serviceRequest._id,
    provider: serviceRequest.providerId,
  });
});

// ================================== Delete Service Request ===================================
const deleteServiceRequest = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const requestId = validMongooseId(res, req.params?.requestId);
  const serviceRequest = await ServiceRequest.findOne({
    _id: requestId,
    userId: _id,
  });
  if (!serviceRequest) {
    res.status(404);
    throw new Error("Service request not found");
  }
  if (serviceRequest.status === "PENDING") {
    await serviceRequest.deleteOne();

    serviceRequest.notifiedProviders.map(async (provider) => {
      const socketId = global.providerSockets[provider.toString()];
      if (socketId) {
        global.io.to(socketId).emit("delete-request", serviceRequest._id);
      }
    });

    successHandler(req, res, {
      remark: "Service request deleted successfully",
    });
  } else {
    res.status(404);
    throw new Error("Connot delete this service request");
  }
});

// ================================== Cancel Service Request =====================================
const cancelRequest = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const requestId = validMongooseId(res, req.params?.requestId);
  const { cancelReason } = req.body;

  if (!requestId || !cancelReason) {
    res.status(400);
    throw new Error("Please provide requestId and cancelReason");
  }

  const user = await User.findOne({ _id, status: true });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const request = await ServiceRequest.findById(requestId);
  if (!request) {
    res.status(404);
    throw new Error("Service request not found");
  }

  if (request.status !== "PROGRESS") {
    res.status(400);
    throw new Error("You can't cancel this request now");
  }

  if (user.isServiceProvider) {
    // Provider logic
    const provider = await ServiceProvider.findOne({
      userId: user._id,
      status: true,
    });
    if (!provider) {
      res.status(404);
      throw new Error("Provider not found or inactive");
    }

    const isAssigned = request.notifiedProviders
      .map((id) => id.toString())
      .includes(provider._id.toString());

    if (!isAssigned) {
      res.status(400);
      throw new Error("You are not assigned to this request");
    }

    request.status = "CANCELED";
    request.cancelReason = cancelReason;
    await request.save();

    const userSocket = global.providerSockets?.[request.userId.toString()];
    if (userSocket) {
      global.io.to(userSocket).emit("cancel-request", request._id);
    }
  } else {
    // User logic
    if (request.userId.toString() !== user._id.toString()) {
      res.status(403);
      throw new Error("Unauthorized to cancel this request");
    }

    request.status = "CANCELED";
    request.cancelReason = cancelReason;
    await request.save();

    if (request.providerId) {
      const providerSocket =
        global.providerSockets?.[request.providerId.toString()];
      if (providerSocket) {
        global.io.to(providerSocket).emit("cancel-request", request._id);
      }
    }
  }

  return successHandler(req, res, {
    remark: "Service request canceled successfully",
  });
});

// ================================== Exporting all functions ===================================
module.exports = {
  createServiceRequest,
  allServiceRequestsList,
  usersServiceRequestList,
  serviceRequestDetails,
  completeRequest,
  acceptRequest,
  declineRequest,
  serviceRequestById,
  deleteServiceRequest,
  cancelRequest,
  allProvidersRequest
  // providerServiceList,
};
