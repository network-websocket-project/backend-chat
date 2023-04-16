const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  nickname: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  pic: {
    type: String,
    required: true,
    default: null,
  },
},{
    timestamps:true
});


const User=mongoose.model("User",userSchema);
module.exports = User;