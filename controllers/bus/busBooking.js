const axios = require("axios");
const asyncHandler = require("express-async-handler");
const {
  generatePaySprintToken,
} = require("../../common/generatePaySprintToken");
const successHandler = require("../../common/successHandler");

const BUS_SOURCE_LIST = asyncHandler(async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.PAYSPRINT_BASEURL}/service-api/api/v1/service/bus/ticket/source`,
      {},
      {
        headers: {
          Token: generatePaySprintToken(),
          Authorisedkey: process.env.PAYSPRINT_AUTHORIZED_KEY,
        },
      }
    );

    successHandler(req, res, {
      Remarks: response.data.status ? "Fetch Success" : "Something Went Wrong",
      Data: response.data.data,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  BUS_SOURCE_LIST,
};
