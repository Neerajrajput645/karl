// const Game = require("../models/gameSchema");
// const asyncHandler = require("express-async-handler");
// const successHandler = require("../common/successHandler");
// const { otherPicResize } = require("../common/imageResize");
// const deletePreviousImage = require("../common/deletePreviousImage");
// const { encryptFunc } = require("../common/encryptDecrypt");

// // Game list
// const gameList = asyncHandler(async (req, res) => {
//   const filter = {};

//   if (req.query.category) filter.category = req.query.category;
//   if (req.query.status) filter.status = req.query.status;

//   const all = await Game.find(filter);
//   successHandler(req, res, {
//     Remarks: `Fetched all Games`,
//     Data:(all.reverse()),
//   });
// });

// // Add Game
// const addGame = asyncHandler(async (req, res) => {
//   if (req?.file?.path) {
//     otherPicResize(req.file.path);
//   }

//   const result = await Game.create({
//     ...req.body,
//     image: req?.file?.path,
//   });

//   successHandler(req, res, {
//     Remarks: `Game added successfully`,
//     Data: result,
//   });
// });

// // Update Game
// const updateGame = asyncHandler(async (req, res) => {
//   const { gameId } = req.params;
//   const gameFound = await Game.findById(gameId);

//   if (!gameFound) {
//     res.status(400);
//     throw new Error("Invalid game ID");
//   }

//   if (req?.file?.path) {
//     otherPicResize(req.file.path);
//     deletePreviousImage(gameFound.image);
//   }

//   await Game.findByIdAndUpdate(gameId, {
//     ...req.body,
//     image: req?.file?.path || gameFound.image,
//   });

//   successHandler(req, res, {
//     Remarks: `Game updated successfully`,
//   });
// });

// // Delete Game
// const deleteGame = asyncHandler(async (req, res) => {
//   const { gameId } = req.params;
//   const gameFound = await Game.findById(gameId);

//   if (!gameFound) {
//     res.status(400);
//     throw new Error("Invalid game ID");
//   }

//   deletePreviousImage(gameFound.image);
//   const result = await Game.findByIdAndRemove(gameId);

//   successHandler(req, res, {
//     Remarks: `Game deleted successfully`,
//     Data: result,
//   });
// });

// module.exports = {
//   gameList,
//   addGame,
//   deleteGame,
//   updateGame,
// };
