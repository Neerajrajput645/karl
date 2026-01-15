
// module.exports = (io) => {
//   io.on("connection", (socket) => {
//     console.log("⚡ New socket connected:", socket.id);

//     // Debug all events
//     socket.onAny((event, ...args) => {
//       console.log(`🛰️ [${socket.id}] Event: '${event}'`, args);
//     });

//     // ✅ Register provider
//     socket.on("register-provider", (providerId) => {
//       global.providerSockets[providerId] = socket.id;
//       console.log(`✅ Registered provider ${providerId} → ${socket.id}`);
//     });

//     // Disconnect logic
//     socket.on("disconnect", () => {
//       for (const [pid, sid] of Object.entries(global.providerSockets)) {
//         if (sid === socket.id) {
//           delete global.providerSockets[pid];
//           console.log(`🔌 Disconnected provider ${pid}`);
//         }
//       }
//     });
//   });
// };
