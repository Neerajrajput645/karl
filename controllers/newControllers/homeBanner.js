const HomeBanner = require("../../models/newModels/homeBanner");
const asyncHandler = require("express-async-handler");
const successHandler = require("../../common/successHandler");
const deletePreviousImage = require("../../common/deletePreviousImage");

//========================== GET ALL BANNERS ==========================
const getHomeBanners = asyncHandler(async (req, res) => {
  const all = await HomeBanner.find({status:true}).sort({ createdAt: -1 });
  successHandler(req, res, {
    Remarks: "Home banners fetched successfully",
    Data: all,
  });
});

// ========================== GET ALL BANNERS FOR ADMIN ==========================
const getHomeBannersAdmin = asyncHandler(async (req, res) => {
  const all = await HomeBanner.find().sort({ createdAt: -1 });

  successHandler(req, res, {
    Remarks: "Home banners fetched successfully",
    Data: all,
  });
});

// ========================== CREATE BANNER ==========================
const createHomeBanner = asyncHandler(async (req, res) => {
  const { name, link } = req.body;

  const newBanner = new HomeBanner({
    name,
    link,
    image: req?.file?.path,
    status: true,
  });

  const saved = await HomeBanner.create(newBanner);

  successHandler(req, res, {
    Remarks: "Home banner created successfully",
    Data: saved,
  });
});

// =========================== UPDATE BANNER ==========================
const updateHomeBanner = asyncHandler(async (req, res) => {
  const { bannerId } = req.params;

  const found = await HomeBanner.findById(bannerId);
  if (!found) {
    res.status(400);
    throw new Error("Invalid banner id");
  }

  if (req.file) {
    deletePreviousImage(found.image);
  }

  const updated = await HomeBanner.findByIdAndUpdate(
    bannerId,
    {
      ...req.body,
      image: req.file ? req.file.path : found.image,
    },
    { new: true }
  );

  successHandler(req, res, {
    Remarks: "Home banner updated successfully",
    Data: updated,
  });
});

//  ========================= DELETE BANNER ==========================
const deleteHomeBanner = asyncHandler(async (req, res) => {
  const { bannerId } = req.params;

  const found = await HomeBanner.findById(bannerId);
  if (!found) {
    res.status(400);
    throw new Error("Invalid banner id");
  }
  if(found.image) deletePreviousImage(found.image);
  const removed = await HomeBanner.findByIdAndDelete(bannerId);

  successHandler(req, res, {
    Remarks: "Home banner deleted successfully",
    Data: removed,
  });
});

module.exports = {
  getHomeBanners,
  getHomeBannersAdmin,
  createHomeBanner,
  updateHomeBanner,
  deleteHomeBanner,
};
