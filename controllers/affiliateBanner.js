const AffiliateBanner = require("../models/affiliateBannerSchema");
const asyncHandler = require("express-async-handler");
const successHandler = require("../common/successHandler");
const { otherPicResize } = require("../common/imageResize");
const deletePreviousImage = require("../common/deletePreviousImage");
const { encryptFunc } = require("../common/encryptDecrypt");

// banner list
const bannerList = asyncHandler(async (req, res) => {
  const all = req.query
    ? await AffiliateBanner.find(req.query)
    : await AffiliateBanner.find();

  // success respond
  successHandler(req, res, {
    Remarks: `Fetch all affiliate banners`,
    Data: (all.reverse()),
  });
});

// add banner
const addBanner = asyncHandler(async (req, res) => {
  const { section } = req.body;
  const newBanner = new AffiliateBanner({
    ...req.body,
    image: req?.file?.path,
  });
  const result = await AffiliateBanner.create(newBanner);

  // success handler
  successHandler(req, res, {
    Remarks: `Added affiliate banner for ${section} section`,
    Data: result,
  });
});

// update banner
const updateBanner = asyncHandler(async (req, res) => {
  // banner section should be (services, games, shopping)
  const { bannerId } = req.params;
  const bannerFound = await AffiliateBanner.findById(bannerId);

  if (bannerFound) {
    if (req.file) {
      deletePreviousImage(bannerFound.image);
    }

    await AffiliateBanner.findByIdAndUpdate(bannerId, {
      ...req.body,
      image: req.file ? req?.file?.path : bannerFound.image,
    });
    //   success handler
    successHandler(req, res, {
      Remarks: `Updated banner for ${bannerFound.section} section`,
    });
  } else {
    res.status(400);
    throw new Error("Invalid banner id");
  }
});

// delete banner
const deleteBanner = asyncHandler(async (req, res) => {
  // banner section should be (services, games, shopping)
  const { bannerId } = req.params;
  const bannerFound = await AffiliateBanner.findById(bannerId);

  if (bannerFound) {
    deletePreviousImage(bannerFound.image);
    const result = await AffiliateBanner.findByIdAndRemove(bannerId);
    //   success handler
    successHandler(req, res, { Remarks: `Removed banner`, Data: result });
  } else {
    res.status(400);
    throw new Error("Invalid banner id");
  }
});

module.exports = { bannerList, addBanner, deleteBanner, updateBanner };
