const fs = require("fs");

const deletePreviousImage = (filePath) => {
  fs.unlink(filePath, function (err) {
    console.log("File deleted!");
  });
};

module.exports = deletePreviousImage;
