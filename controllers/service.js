const Service = require("../models/serviceSchema");
const asyncHandler = require("express-async-handler");
const successHandler = require("../common/successHandler");
const deletePreviousImage = require("../common/deletePreviousImage");
const { encryptFunc } = require("../common/encryptDecrypt");
const Commission = require("../models/newModels/commission");
// service list
const serviceList = asyncHandler(async (req, res) => {
  console.log("ads");
  const allServices = req.query
    ? await Service.find(req.query).sort([["createdAt", 1]])
    : await Service.find().sort([["createdAt", 1]]);
  // success respond
  successHandler(req, res, {
    Remarks: "Fetch all services",
    Data: req.query.section
      ? ({ [req.query.section]: allServices })
      : (allServices),
  });
});

// add service
const addService = asyncHandler(async (req, res) => {
  const sections = ["finance", "travel", "recharge", "loan", "insurance", ""];

  if (!sections.includes(req.body.section)) {
    res.status(400);
    throw new Error("Please enter valid section,");
  }
  const newService = new Service({ ...req.body, icon: req?.file?.path });

  // create new service
  await newService.save();

  // success handler
  successHandler(req, res, { Remarks: "Added service" });
});

// update service
const updateService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const serviceFound = await Service.findById(serviceId);
  console.log("serviceFound", serviceFound);
  if (serviceFound) {
    if (req.file) {
      deletePreviousImage(serviceFound.icon);
    }

    await Service.findByIdAndUpdate(serviceId, {
      $set: {
        ...req.body,
        icon: req.file ? req?.file?.path : serviceFound.icon,
      },
    });
    // if service status turn into false that time commission also have to false
    console.log("req.body", req.body);
    const updatedService = await Service.findById(serviceId);
    console.log("updatedService", updatedService);
if (typeof req.body?.status === "boolean") {
    const commission = await Commission.findOne({ serviceId: serviceId });
    console.log("commission", commission);
    if (commission) {
      console.log("inside commission update");
      await commission.updateOne({ $set: { status: req.body.status } });
      console.log("commission updated to false");
    }

  }
    // success handler
    successHandler(req, res, { Remarks: "Updated service" });
  } else {
    res.status(400);
    throw new Error("Invalid service id.");
  }
});

// remove service
const deleteService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const serviceFound = await Service.findById(serviceId);
  if (serviceFound) {
    deletePreviousImage(serviceFound.icon);

    // delete service
    await Service.findByIdAndRemove(serviceId);
    // success handler
    successHandler(req, res, { Remarks: "Removed service" });
  } else {
    res.status(400);
    throw new Error("Invalid service id");
  }
});

// const shownServices = asyncHandler(async (req, res) => {
//   const services = await Service.find({ isShow: true }).sort([["createdAt", 1]]);
//   successHandler(req, res, {
//     Remarks: "Fetch shown services",
//     Data: services,
//   });
// });


module.exports = { serviceList, addService, updateService, deleteService };
