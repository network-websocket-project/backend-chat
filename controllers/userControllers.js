const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");

const registerUser = asyncHandler(async (req, res) => {
  const { nickname, username, password, avatar } = req.body;
  console.log(req.body);
  if (!nickname || !username || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const hashedPw = await bcrypt.hash(password, 12);
  const user = await User.create({
    nickname,
    username,
    password: hashedPw,
    avatar,
  });
  if (user) {
    res.status(201).json({
      id: user._id,
      nickname: user.nickname,
      username: user.username,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

const authMe = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findOne({ _id });
  user.isOnline = true;
  await user.save();
  if (user) {
    res.json({
      id: user._id,
      nickname: user.nickname,
      username: user.username,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  user.isOnline = true;
  await user.save();
  if (user && (await user.matchPassword(password))) {
    res.json({
      id: user._id,
      nickname: user.nickname,
      username: user.username,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

const logout = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  user.isOnline = false;
  await user.save();
  res.status(200).json({ message: "Successfully logged out" });
});

const searchAllUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
      $or: [
        { nickname: { $regex: req.query.keyword, $options: "i" } },
        { username: { $regex: req.query.keyword, $options: "i" } },
      ],
    }
    : {};
  console.log(req.user);
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const editUser = asyncHandler(async (req, res) => {
  const { nickname } = req.body;
  console.log(req);
  const { _id } = req.user._id;
  const user = await User.findById(_id);
  user.nickname = nickname;
  user.avatar = req.avatar;
  await user.save();
  res.send(user);
});

module.exports = {
  registerUser,
  authUser,
  searchAllUsers,
  authMe,
  editUser,
  getAllUsers,
  logout,
};

//.find({_id:{$ne:req.user._id}})
