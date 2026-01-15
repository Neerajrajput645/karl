const fs = require("fs");
const multer = require("multer");

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Unsupported file format, only jpg, png & webp file allowed.")
    );
  }
};

// ----------------------------------------- PROFILE ------------------------------------- //
const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = `uploads/users`;
    // Create the dynamic folder if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", "-"));
  },
});
const userProfileUpload = multer({
  storage: storage1,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
  fileFilter,
});

// ----------------------------------------- APP LOGO ------------------------------------- //
const storage11 = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = `uploads/appLogo`;
    // Create the dynamic folder if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", "-"));
  },
});
const appLogoUpload = multer({
  storage: storage11,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
  fileFilter,
});

// ----------------------------------------- SERVICE ICON ------------------------------------- //
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = `uploads/services`;
    // Create the dynamic folder if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", "-"));
  },
});
const serviceUpload = multer({
  storage: storage2,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
  fileFilter,
});

// ----------------------------------------- CATEGORY & Bussiness Category ------------------------------------- //
const storage3 = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = `uploads/categories`;
    // Create the dynamic folder if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", "-"));
  },
});
const categoryUpload = multer({
  storage: storage3,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
  fileFilter,
});

// ----------------------------------------- SUB CATEGORY ------------------------------------- //
const storage4 = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = `uploads/subCategories`;
    // Create the dynamic folder if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", "-"));
  },
});
const subCategoryUpload = multer({
  storage: storage4,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
  fileFilter,
});

// ----------------------------------------- KYC DOCUMENTS ------------------------------------- //
const storage5 = multer.diskStorage({
  destination: function (req, file, cb) {
    const userFound = req.data;
    const destination = `uploads/kyc/${userFound._id}/`;

    // Create the dynamic folder if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", "-"));
  },
});
const userDocuments = multer({
  storage: storage5,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
  fileFilter,
});

// ----------------------------------------- BANNERS IMAGES ------------------------------------- //
const storage6 = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = `uploads/banners/`;

    // Create the dynamic folder if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", "-"));
  },
});
const storage12 = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = `uploads/game/`;

    // Create the dynamic folder if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", "-"));
  },
});
const bannerUploads = multer({
  storage: storage6,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
  fileFilter,
});
const gameUploads = multer({
  storage: storage12,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
  fileFilter,
});

const storage60 = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = `uploads/affiliateBanners/`;

    // Create the dynamic folder if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", "-"));
  },
});
const affiliateBannerUploads = multer({
  storage: storage60,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
  fileFilter,
});

// ----------------------------------------- SHOP BANNERS IMAGES ------------------------------------- //
const storage7 = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = `uploads/shopBanners/`;

    // Create the dynamic folder if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", "-"));
  },
});
const shopBannerUpload = multer({
  storage: storage7,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
  fileFilter,
});

// ----------------------------------------- PRODUCT IMAGES ------------------------------------- //
const storage8 = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = `uploads/products/`;

    // Create the dynamic folder if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", "-"));
  },
});
const productImageUpload = multer({
  storage: storage8,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
  fileFilter,
});

// ----------------------------------------- PRODUCT REVIEW IMAGES ------------------------------------- //
const storage9 = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = `uploads/ratings`;

    // Create the dynamic folder if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", "-"));
  },
});
const ratingImages = multer({
  storage: storage9,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
  fileFilter,
});

// ----------------------------------------- PRODUCT REVIEW IMAGES ------------------------------------- //
const storage10 = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = `uploads/affiliate`;

    // Create the dynamic folder if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", "-"));
  },
});
const affiliateImage = multer({
  storage: storage10,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
  fileFilter,
});


// ----------------------------------------- PROVIDER SERVICE CATEGORY IMAGES ------------------------------------- //
const storage13 = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = `uploads/serviceCategory`;

    // Create the dynamic folder if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", "-"));
  },
});
const serviceCategoryImages = multer({
  storage: storage13,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
  fileFilter,
});

// ----------------------------------------------PROVIDER SERVICE IMAGES UPLOAD------------------------------------- //

const storage14 = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = `uploads/providerService`;
    // Create the dynamic folder if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", "-"));
  },
});
const serviceImages = multer({
  storage: storage14,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
  fileFilter,
});

// ----------------------------------------- Commissions ------------------------------------- //

const storage15 = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = `uploads/commissions`;
    // Create the dynamic folder if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", "-"));
  },
});
const commissionImages = multer({
  storage: storage15,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
  fileFilter,
});


// ----------------------------------------- Home Banners ------------------------------------- //

const storage16 = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = `uploads/homeBanners`;
    // Create the dynamic folder if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", "-"));
  },
});
const homeBannerImages = multer({
  storage: storage16,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
  fileFilter,
});


// ----------------------------------------- Notification Image ------------------------------------- //

const storage17 = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = `uploads/notification`;
    // Create the dynamic folder if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replaceAll(" ", "-"));
  },
});
const notificationImage = multer({
  storage: storage17,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
  fileFilter,
});


module.exports = {
  userProfileUpload,
  serviceUpload,
  categoryUpload,
  subCategoryUpload,
  shopBannerUpload,
  userDocuments,
  affiliateImage,
  bannerUploads,
  gameUploads,
  productImageUpload,
  ratingImages,
  appLogoUpload,
  homeBannerImages,
  affiliateBannerUploads,
  commissionImages,
  serviceCategoryImages,
  serviceImages,
  notificationImage
};
