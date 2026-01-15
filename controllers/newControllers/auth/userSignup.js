const asyncHandler = require("express-async-handler");
const successHandler = require("../../../utils/responseHandler/successHandler");
const Service = require("../../../models/serviceSchema");
const Otp = require("../../../models/otpSchema");
const generateOTP = require("../../../common/generateOtp");
const sendSMS = require("../../../common/sendSMS");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const getIpAddress = require("../../../common/getIpAddress");
const uniqueIdGenerator = require("../../../common/uniqueIdGenerator");
const Wallet = require("../../../models/walletSchema");
const User = require("../../../models/userSchema");

const userSignUp = asyncHandler(async (req, res) => {
    const { firstName, lastName, phone, email, referalId, otp, deviceToken, ResponseStatus } = req.body;

    const findSIGNUPService = await Service.findOne({ name: "SIGNUP" });
    const findLOGINService = await Service.findOne({ name: "LOGIN" });

    // ✅ Step 1: OTP not verified yet → Send OTP
    if (ResponseStatus !== 1) {
        if (!otp) {
            // Prevent spam: allow OTP every 30 sec
            const recentOtp = await Otp.findOne({
                phone,
                created_at: { $gte: new Date(Date.now() - 30 * 1000) },
            });
            if (recentOtp) {
                res.status(400);
                throw new Error("Wait for 30 seconds before requesting a new OTP.");
            }

            // Clear old OTPs and generate new
            await Otp.deleteMany({ phone });
            const generatedOtp = generateOTP({ phone });
            await Otp.create({ phone, otp: generatedOtp });

            sendSMS(phone, generatedOtp);

            return successHandler(req, res, {
                Remarks: "OTP Sent",
                ResponseStatus: 3,
                // Otp: generatedOtp, // (don’t send in production 🚫)
            });
        } else {
            // ✅ Step 2: OTP verification
            if (!findLOGINService.status) {
                res.status(400);
                throw new Error("Login is Temporarely Closed 😞");
            }

            // Master OTP (for dev/testing)
            if (phone == 7723970629 && otp == 123) {
                const findUser = await User.findOne({ phone });
                return successHandler(req, res, {
                    Remarks: "Login Success",
                    ResponseStatus: 2,
                    AccessToken: jwt.sign({ _id: findUser._id }, JWT_SECRET),
                });
            }

            const foundOTP = await Otp.findOne({ phone, otp });
            if (!foundOTP) {
                res.status(400);
                throw new Error("Invalid Otp");
            }

            // Check expiry (5 min)
            if (foundOTP.created_at < new Date(Date.now() - 5 * 60 * 1000)) {
                await Otp.deleteOne({ _id: foundOTP._id });
                res.status(400);
                throw new Error("OTP has expired.");
            }

            // Valid OTP → delete it
            await Otp.deleteOne({ _id: foundOTP._id });

            const findUser = await User.findOne({ phone });

            if (findUser) {
                if (!findUser.status) {
                    res.status(400);
                    throw new Error("You are blocked");
                }

                // Update device token if provided
                if (deviceToken) {
                    await User.findByIdAndUpdate(findUser._id, { $set: { deviceToken } });
                }

                return successHandler(req, res, {
                    Remarks: "Login Success",
                    ResponseStatus: 2,
                    AccessToken: jwt.sign({ _id: findUser._id }, JWT_SECRET),
                });
            }

            // User does not exist → go to signup flow
            return successHandler(req, res, {
                Remarks: "Otp Verify Success",
                ResponseStatus: 1,
            });
        }
    }

    // ✅ Step 3: OTP already verified → Signup flow
    if (!findSIGNUPService.status) {
        res.status(400);
        throw new Error("Registration is Temporarely Closed 😞");
    }

    // Validations
    if (!firstName || !lastName || !email) {
        res.status(400);
        throw new Error("(firstName, lastName, email) fields are mandatory");
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        res.status(400);
        throw new Error("Email is already used.");
    }
    const existingUser = await User.findOne({ deviceToken });
    if (existingUser) {
        res.status(400);
        throw new Error("Multiple signups from the same device are not allowed.");
    }

    // Validate referalId
    if (referalId) {
        const referalFound = await User.findOne({ referalId });
        if (!referalFound) {
            res.status(400);
            throw new Error("Please enter valid referalId.");
        }
    }

    // Generate unique referalId
    let createReferId = uniqueIdGenerator("referalId");
    const checkExistReferId = await User.findOne({ referalId: createReferId });
    if (checkExistReferId) {
        createReferId = uniqueIdGenerator("referalId");
    }

    // Create user
    const newUser = new User({
        firstName,
        lastName,
        email,
        phone,
        deviceToken,
        referBy: referalId,
        referalId: createReferId,
        ipAddress: getIpAddress(req),
    });
    await newUser.save();

    // Send welcome email
    sendEmail({ phone, email, firstName }, "USER_CONGRATES");

    // Create wallet
    const newWallet = new Wallet({ userId: newUser._id });
    await newWallet.save();

    // Link wallet to user
    newUser.wallet = newWallet._id;
    await newUser.save();

    return successHandler(req, res, {
        Remarks: "Register success.",
        AccessToken: jwt.sign({ _id: newUser._id }, JWT_SECRET),
    });
});

module.exports = {
    userSignUp
};