// const ServiceProvider = require("../../models/newModels/serviceProvider");

// // Store last location per providerId
// const currentLocations = {};

// // Utility: Haversine formula to calculate distance in meters
// function calculateDistance(lat1, lon1, lat2, lon2) {
//   const toRad = (val) => (val * Math.PI) / 180;
//   const R = 6371e3; // Radius of Earth in meters
//   const φ1 = toRad(lat1);
//   const φ2 = toRad(lat2);
//   const Δφ = toRad(lat2 - lat1);
//   const Δλ = toRad(lon2 - lon1);

//   const a =
//     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c; // Distance in meters
// }

// module.exports = (io, socket) => {
//   socket.on("update-location", async ({ providerId, newLocation }) => {
//     try {
//       const { longitude, latitude } = newLocation || {};
//       if (!providerId || !longitude || !latitude) {
//         return socket.emit("update-location-response", {
//           success: false,
//           message: "Missing required data (providerId or location)",
//         });
//       }

//       const prev = currentLocations[providerId];

//       // If location changed more than 50 meters, update
//       let shouldUpdate = false;
//       if (!prev) {
//         shouldUpdate = true;
//       } else {
//         const distance = calculateDistance(
//           prev.longitude,
//           prev.latitude,
//           longitude,
//           latitude
//         );
//         if (distance > 50) shouldUpdate = true;
//       }

//       if (shouldUpdate) {
//         const provider = await ServiceProvider.findById(providerId);
//         if (!provider) {
//           return socket.emit("update-location-response", {
//             success: false,
//             message: "Provider not found",
//           });
//         }

//         provider.location = {
//           type: "Point",
//           coordinates: [longitude, latitude],
//         };
//         await provider.save();

//         currentLocations[providerId] = { longitude, latitude };

//         socket.emit("update-location-success", {
//           message: "Location updated successfully",
//         });
//       } else {
//         // Optional: can omit this message or keep it minimal
//         socket.emit("update-location-success", {
//           message: "Moved less than 50 meters – update skipped",
//         });
//       }
//     } catch (error) {
//       console.error("Location update error:", error);
//       socket.emit("update-location-response", {
//         success: false,
//         message: "Something went wrong while updating location",
//       });
//     }
//   });
// };
