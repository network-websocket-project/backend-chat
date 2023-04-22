const asyncHandler = require("express-async-handler");
const Noti = require("../models/notiModel");
const Chat = require("../models/chatModel");

const getNotiByUserId = asyncHandler(async (req, res) => {
  const notifications = await Noti.find({ receiver: req.user._id });
  res.send(notifications);
});

const sendNoti = asyncHandler(async (req, res) => {
  const { chatId,isGroup } = req.body;
  const userId = req.user._id;
  try {
    const notiExists = await Noti.find({ chat: chatId });
    const notiUser = notiExists.map((notiExist) =>
      notiExist.receiver.toString()
    );
    const chat = await Chat.findOne({ _id: chatId });
    chat.users.forEach(async (user) => {
      if (user._id.toString() == userId.toString()) return;
      console.log(user._id.toString() === userId.toString());
      if (!notiUser.includes(user._id.toString())) {
        await Noti.create({
          sender: userId,
          receiver: user._id,
          isNoti: true,
          chat: chatId,
          isGroup
        });
      } else {
        await Noti.findOneAndUpdate(
          { receiver: user._id },
          { isNoti: true },
          { new: true }
        );
      }
    });
    res.status(200).json({message:"success"});
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const readNoti = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  console.log(chatId);
  const noti = await Noti.findOne({ receiver: req.user._id, chat: chatId });
  console.log(noti);
  if (!noti) {
    res.status(200).json({ message: "No need to update your noti" });
  } else {
    noti.isNoti = false;
    await noti.save();
    res.status(200).json({ message: "Updated successfully" });
  }
});

module.exports = { getNotiByUserId, sendNoti, readNoti };
