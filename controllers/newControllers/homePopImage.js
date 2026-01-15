const HomePopImage = require("../../models/newModels/homePopImage");
const asyncHandler = require("express-async-handler");
const successHandler = require("../../common/successHandler");
const deletePreviousImage = require("../../common/deletePreviousImage");

// ================= GET ACTIVE BANNER ==========================
const getHomePopImage = asyncHandler(async (req, res) => {
    
    const image = await HomePopImage.findOne({status: true}).sort({ createdAt: -1 }).select("image link");
    console.log(image);
    if (!image) {
        res.status(404);
        throw new Error("Home pop image not found");
    }
    successHandler(req, res, {
        Remarks: "Home pop images fetched successfully",
        Data: image,
    });
});

// ================= GET ALL BANNERS FOR ADMIN ==========================
const getHomePopImagesAdmin = asyncHandler(async (req, res) => {
    const all = await HomePopImage.findOne().sort({ createdAt: -1 });

    successHandler(req, res, {
        Remarks: "Home pop images fetched successfully",
        Data: all,
    });
});

// ================ UPDATE BANNER ==========================
const updateHomePopImage = asyncHandler(async (req, res) => {
    // Fetch existing record
    const existing = await HomePopImage.findOne();
    if (!existing) {
        res.status(404);
        throw new Error("Home pop image record not found");
    }

    // Delete old image if new image uploaded
    if (req.file && existing.image) {
        deletePreviousImage(existing.image);
    }

    // Prepare update payload
    const payload = {
        link: req.body.link || existing.link,
        image: req.file ? req.file.path : existing.image,
    };

    // Update record
    const updated = await HomePopImage.findByIdAndUpdate(
        existing._id,
        payload,
        { new: true }
    );

    return successHandler(req, res, {
        Remarks: "Home pop image updated successfully",
        Data: updated,
    });
});


module.exports = {
    getHomePopImage,
    getHomePopImagesAdmin,
    updateHomePopImage,
};
