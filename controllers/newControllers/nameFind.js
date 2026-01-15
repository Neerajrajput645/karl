const PrivacyPolicy = require("../../models/newModels/privacyPolicy");
const asyncHandler = require("express-async-handler");
const successHandler = require("../../common/successHandler");
const validMongooseId = require("../../common/new/mongoIDvalidation");

const getNameFromNumber = (number)=>{
    // logic to get name from number
}




const findName = asyncHandler(async (req, res) => {
    try {
        const { number } = req.params;
        const name = getNameFromNumber(number); // Assume this function retrieves the name based on the number
        return successHandler(res, { name });
    } catch (error) {
        // Handle error
        res.status(500);
        throw new Error("Error fetching name");

    }
});

module.exports = {
    findName,
};
