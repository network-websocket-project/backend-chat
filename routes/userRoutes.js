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

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/logout",protect,logout)
router.post("/loginme", protect, authMe);
router.put("/edit", protect, editUser);
router.get("/search", protect, searchAllUsers);
router.get("/",protect,getAllUsers)

module.exports = router;
