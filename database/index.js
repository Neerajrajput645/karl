const mongoose = require("mongoose");
// const scheduleJobs = require("../common/jobs/statusChecker");
const MONGO_URI = process.env.MONGO_URI;

const connection = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Connected to database");
      // scheduleJobs();
    })
    .catch((error) => console.log(error, "error"));
};

module.exports = connection;
