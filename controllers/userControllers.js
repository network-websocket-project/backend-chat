const asyncHandler=require('express-async-handler')
const User=require('../models/userModel')
const generateToken=require('../config/generateToken')

const registerUser=asyncHandler(async(req,res)=>{
    const {nickname,username,password,avatar}=req.body

    if(!nickname||!username||!password){
        res.status(400);
        throw new Error("Please Enter all the Fields")
    }

    const userExists=await User.findOne({username});

    if(userExists){
        res.status(400);
        throw new Error("User already exists")
    }

    const user=await User.create({
        nickname,
        username,
        password,
        avatar,
    })
    if(user){
        res.status(201).json({
            id:user._id,
            name:user.nickname,
            email:user.username,
            avatar:user.avatar,
            token:generateToken(user._id)
        })
    }else{
        res.status(400);
        throw new Error("Failed to create user")
    }
});

const authUser=asyncHandler(async(req,res)=>{
    const {username,password}=req.body;
    const user=await User.findOne({username});
    if(user&&(await user.matchPassword(password)) ){
        res.json({
            id:user._id,
            nickname:user.name,
            username:user.username,
            avatar:user.avatar,
            token:generateToken(user._id),
        })
    }else{
        res.status(401);
        throw new Error("Invalid username or password");
    }
})


module.exports={registerUser,authUser}