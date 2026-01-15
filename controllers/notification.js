const asyncHandler = require("express-async-handler");
const successHandler = require("../common/successHandler");
const Notification = require("../models/notificationSchema");
const sendNotification = require("../common/sendNotification");
const { encryptFunc } = require("../common/encryptDecrypt");
const userSchema = require("../models/userSchema");
const OneSignal = require("@onesignal/node-onesignal");

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;
const app_key_provider = {
  getToken() {
    return ONESIGNAL_REST_API_KEY;
  },
};

const admin = require("firebase-admin");

// Initialize Firebase Admin
const serviceAccount = require("../data/firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const configuration = OneSignal.createConfiguration({
  authMethods: {
    app_key: {
      tokenProvider: app_key_provider,
    },
  },
});

const client = new OneSignal.DefaultApi(configuration);

// notification list by user
const notificationListByUser = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const data = await Notification.find({ recipient: _id }).populate("sender");

  // success handler
  successHandler(req, res, {
    Remarks: "Fetch all notifications",
    Data: (data.reverse()),
  });
});

// notification list
const notificationList = asyncHandler(async (req, res) => {
  const data = await Notification.find({ byAdmin: true });
  // success handler
  successHandler(req, res, {
    Remarks: "Fetch all notifications",
    Data: (data.reverse()),
  });
});

// push notification
// const pushNotification = asyncHandler(async (req, res) => {
//   const { title, content } = req.body;
//   const data = { title, body: content };

//   await Notification.create({ ...data, byAdmin: true });
//   const deviceToken = "all";
//   deviceToken && sendNotification(data, deviceToken);

//   // success handler
//   successHandler(req, res, { Remarks: "Pushed notifications to all users" });
// });

const chunkArray = (array, size) => {
  console.log("Calling");
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const pushNotification = asyncHandler(async (req, res) => {
  try {
    const { title, content, data } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const payloadData = {
      title,
      body: content,
    };

    console.log("Sending FCM notification:", payloadData);

    // ✅ 1. Get all users who can receive notifications
    const users = await userSchema.find({
      deviceToken: { $ne: null },
      doNotNotify: { $ne: true },
    }).select("deviceToken");

    const tokens = users
      .map((user) => user.deviceToken)
      .filter(
        (token) =>
          typeof token === "string" &&
          token.trim() !== ""
      );

    if (tokens.length === 0) {
      return successHandler(req, res, {
        Remarks: "No users found to notify",
        count: 0,
      });
    }

    console.log(`Total Users to Notify: ${tokens.length}`);

    // ✅ 2. Firebase allows max 500 tokens per batch
    const batches = chunkArray(tokens, 500);

    let successCount = 0;
    let failureCount = 0;

    for (const batch of batches) {
      const message = {
        tokens: batch,
        notification: {
          title,
          body: content,
        },
        // Used for Notifee + background handling
        data: data || {},
      };

      const response = await admin.messaging().sendEachForMulticast(message);

      successCount += response.successCount;
      failureCount += response.failureCount;

      if (response.failureCount > 0) {
        response.responses.forEach((resp, index) => {
          if (!resp.success) {
            console.error(
              "FCM Error for token:",
              batch[index],
              resp.error?.message
            );
          }
        });
      }
    }

    // ✅ 3. Save notification in DB (same as old system)
    await Notification.create({
      title,
      body: content,
      byAdmin: true,
    });

    // ✅ 4. Final Success Response
    successHandler(req, res, {
      Remarks: "Notifications sent successfully",
      totalUsers: tokens.length,
      successCount,
      failureCount,
    });
  } catch (error) {
    console.error("FCM Bulk Notification Error:", error);
    return res.status(500).json({
      error: "Failed to send notifications",
      message: error.message,
    });
  }
});

const pushNotificationImage = asyncHandler(async (req, res) => {
  try {
    const { title, content, data } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: "Title and content are required",
      });
    }

    // ✅ Image from upload OR default
    const image =
      req?.file?.path
        ? `https://api.new.techember.in/${req.file.path}`
        : `https://api.new.techember.in/uploads/notification/1765120251484-offer.jpeg`;
    console.log("Notification Image URL:", image);
    const payloadData = {
      title,
      body: content,
      image,
    };

    console.log("Sending Image Notification:", payloadData);

    // ✅ 1. Fetch all users who allow notifications
    const users = await userSchema.find({
      deviceToken: { $ne: null },
      doNotNotify: { $ne: true },
    }).select("deviceToken");

    const tokens = users
      .map((user) => user.deviceToken)
      .filter(
        (token) =>
          typeof token === "string" &&
          token.trim() !== ""
      );

    if (tokens.length === 0) {
      return successHandler(req, res, {
        Remarks: "No users found to notify",
        count: 0,
      });
    }

    console.log(`Total Users to Notify With Image: ${tokens.length}`);

    // ✅ 2. Firebase batch limit = 500
    const batches = chunkArray(tokens, 500);

    let successCount = 0;
    let failureCount = 0;

    for (const batch of batches) {
      const message = {
        tokens: batch,

        // ✅ Main notification (iOS + Android)
        notification: {
          title,
          body: content,
          image, // ⭐ WORKS FOR BOTH iOS & Android
        },

        // ✅ Extra Android enforcement for image
        android: {
          notification: {
            image, // ⭐ VERY IMPORTANT FOR ANDROID
          },
        },

        // ✅ For Notifee background handling
        data: data || {},
      };

      const response = await admin.messaging().sendEachForMulticast(message);

      successCount += response.successCount;
      failureCount += response.failureCount;

      // ✅ Log invalid tokens (optional cleanup)
      if (response.failureCount > 0) {
        response.responses.forEach((resp, index) => {
          if (!resp.success) {
            console.error(
              "FCM Image Error for token:",
              batch[index],
              resp.error?.message
            );
          }
        });
      }
    }

    // ✅ 3. Save notification with image
    await Notification.create({
      title,
      body: content,
      image,
      byAdmin: true,
    });

    // ✅ 4. Final success response
    successHandler(req, res, {
      Remarks: "Image Notifications sent successfully",
      totalUsers: tokens.length,
      successCount,
      failureCount,
    });
  } catch (error) {
    console.error("FCM Bulk Image Notification Error:", error);

    return res.status(500).json({
      error: "Failed to send image notifications",
      message: error.message,
    });
  }
});

const sendNotify = async (data, deviceToken) => {
  try {
    if (!deviceToken) {
      console.log("❌ Device token is missing");
      return null;
    }

    const { title, body } = data;

    const message = {
      token: deviceToken,

      // ✅ Works for Android + iOS
      notification: {
        title: title || "New Notification",
        body: body || "",
      },

      // ✅ For Notifee & background handling
      data: {
        title: title || "",
        body: body || "",
      },
    };

    const response = await admin.messaging().send(message);
    console.log("✅ Notification sent successfully:", response);

    return response;
  } catch (error) {
    console.error("❌ Error sending notification:", error.message);
    return null;
  }
};


module.exports = {sendNotify, notificationListByUser, notificationList, pushNotification, pushNotificationImage };
