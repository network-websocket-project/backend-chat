const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  authUser,
  searchAllUsers,
  authMe,
  editUser,
  getAllUsers,
  logout
} = require("../controllers/userControllers");
const { upload } = require("../middleware/fileupload");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/logout",protect,logout)
router.post("/loginme", protect, authMe);
router.put("/edit", protect, upload.single('avatar'), editUser);
router.get("/search", protect, searchAllUsers);
router.get("/",protect,getAllUsers)

module.exports = router;
