const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  joinGroup,
} = require("../controllers/chatControllers");

const router = express.Router();

router.post("/", protect, accessChat);
router.get("/", protect, fetchChat);
router.post("/group", protect, createGroupChat);
router.put("/rename", protect, renameGroup);
router.put("/join", protect, joinGroup);
// router.route("/groupremove")

module.exports = router;
