const sharp = require("sharp");

// profilePicResize
const profilePicResize = async (path) => {
  const imageBuffer = path;
  if (path) {
    const imageUrl = await sharp(imageBuffer)
      .resize({ width: 240, height: 240 })
      .jpeg({ quality: 100 })
      .toBuffer();
    return await sharp(imageUrl).toFile(imageBuffer);
  }
};

// otherPicResize
const otherPicResize = async (path) => {
  const imageBuffer = path;
  if (path) {
    const imageUrl = await sharp(imageBuffer)
      .resize({ height: 400 })
      .jpeg({ quality: 100 })
      .toBuffer();
    return await sharp(imageUrl).toFile(imageBuffer);
  }
};

module.exports = { profilePicResize, otherPicResize };
