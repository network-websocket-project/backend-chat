const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  joinGroup,
  fetchAllGroupChat,
  fetchAllMyGroupChat,
} = require("../controllers/chatControllers");

const router = express.Router();

router.post("/", protect, accessChat);
router.get("/", protect, fetchChat);
router.get("/myGroupChat",protect,fetchAllMyGroupChat)
router.get("/groupChat",fetchAllGroupChat)
router.post("/group", protect, createGroupChat);
router.put("/rename", protect, renameGroup);
router.put("/join", protect, joinGroup);
// router.route("/groupremove")

module.exports = router;
