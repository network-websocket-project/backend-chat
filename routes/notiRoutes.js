const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getNotiByUserId,
  sendNoti,
  readNoti,
} = require("../controllers/notiController");

const router = express.Router();

router.get("/", protect, getNotiByUserId);
router.post("/", protect, sendNoti);
router.put("/", protect, readNoti);
module.exports = router;
