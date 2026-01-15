const asyncHandler = require("express-async-handler");
const Affiliate = require("../models/affiliateSchema");
const successHandler = require("../common/successHandler");
const deletePreviousImage = require("../common/deletePreviousImage");

// ======================= Get affiliate list ==========================
const affiliateList = asyncHandler(async (req, res) => {

  // Base filter
  const filter = {
    status: true,
    isShow: true,
    ...req.query   // merge user queries if any
  };

  const affiliate = await Affiliate.find(filter).sort([["createdAt", 1]]);

  successHandler(req, res, {
    Remarks: "Fetch all Affiliate",
    Data: req.query.section
      ? { [req.query.section]: affiliate }
      : affiliate,
  });
});

// ======================= Get affiliate list for admin ==========================
const affiliateListAdmin = asyncHandler(async (req, res) => {
  console.log("ads");

  // Base filter
  const filter = {
    status: true,
    isShow: true,
    ...req.query   // merge user queries if any
  };

  const affiliate = await Affiliate.find(filter).sort([["createdAt", 1]]);

  successHandler(req, res, {
    Remarks: "Fetch all Affiliate",
    Data: req.query.section
      ? { [req.query.section]: affiliate }
      : affiliate,
  });
});


// ======================== Create affiliate list ==========================
const createAffiliate = asyncHandler(async (req, res) => {
  const condition = {}
  const {name, route, description, section} = req.body;
  if(name) condition.name = name;
  if(route) condition.route = route;
  if(description) condition.description = description;
  if(section) condition.section = section;
  if(req.file){
    condition.icon = req.file.path;
  }
  const newAffiliate = new Affiliate(condition);
  const result = await newAffiliate.save();
  successHandler(req, res, { Remarks: "Create affiliate item.", Data: result });
});

//========================= Update affiliate list ==========================
const updateAffiliate = asyncHandler(async (req, res) => {
  const { affiliateId } = req.params;
  const findAffiliate = await Affiliate.findById(affiliateId);

  if (!findAffiliate) {
    res.status(400);
    throw new Error("Please enter valid id.");
  }
  deletePreviousImage(findAffiliate.icon);
  const result = await Affiliate.updateOne(
    { _id: affiliateId },
    {
      $set: {
        ...req.body,
        icon: req.file ? req.file.path : findAffiliate.icon,
      },
    }
  );
  successHandler(req, res, { Remarks: "Update affiliate item.", Data: result });
});

// ======================== Remove affiliate ================================= 
const removeAffiliate = asyncHandler(async (req, res) => {
  const { affiliateId } = req.params;
  const findAffiliate = await Affiliate.findById(affiliateId);

  if (!findAffiliate) {
    res.status(400);
    throw new Error("Please enter valid id.");
  }

  deletePreviousImage(findAffiliate.icon);
  const result = await Affiliate.findByIdAndRemove(affiliateId);
  successHandler(req, res, {
    Remarks: "Removed affiliate stroe.",
    Data: result,
  });
});

module.exports = { affiliateList, affiliateListAdmin, removeAffiliate, createAffiliate, updateAffiliate };
