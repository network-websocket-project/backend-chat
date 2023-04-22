const mongoose = require("mongoose");

const notiModel = mongoose.Schema(
  {
    receiver:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isNoti: { type: Boolean, default: false },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Noti", notiModel);

module.exports = Message;
