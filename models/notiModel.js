const mongoose = require("mongoose");

const notiModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isNoti: { type: Boolean, default: false },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    isGroup: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Noti", notiModel);

module.exports = Message;
