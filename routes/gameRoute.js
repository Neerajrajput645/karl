const router = require("express").Router();
const { gameUploads } = require("../common/fileUpload");
const { adminTokenVerify } = require("../common/tokenVerify");
const {
  gameList,
  addGame,
  updateGame,
  deleteGame,
} = require("../controllers/game");

router.get("/list", gameList);
router.delete("/:gameId", adminTokenVerify, deleteGame);
router.post("/create", adminTokenVerify, gameUploads.single("image"), addGame);
router.patch(
  "/:gameId",
  adminTokenVerify,
  gameUploads.single("image"),
  updateGame
);

module.exports = router;
