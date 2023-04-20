const express = require("express");
const {protect}=require('../middleware/authMiddleware')
const {
  registerUser,
  authUser,
  allUsers,
  authMe,
  editUser
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.post('/loginme',protect,authMe)
router.put('/edit',protect,editUser)
router.get("/",protect,allUsers);

module.exports = router;
