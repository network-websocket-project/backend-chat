const express=require('express');
const {protect}=require('../middleware/authMiddleware')
const {accessChat,fetchChat,createGroupChat}=require('../controllers/chatControllers')

const router=express.Router()

router.post("/",protect,accessChat);
router.get("/",protect,fetchChat);
router.post("/group",protect,createGroupChat);
// router.put("/rename",protect,renameGroup);
// router.route("/groupremove")

module.exports=router