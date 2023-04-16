const mongoose = require("mongoose");
const bcrypt=require('bcryptjs')

const userSchema = mongoose.Schema({
  nickname: { type: String, required: true },
  username: { type: String, required: true,unique:true },
  password: { type: String, required: true },
  avatar: {
    type: String,
    default: "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png",
  },
},{
    timestamps:true
});

userSchema.methods.matchPassword=async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password);
}

userSchema.pre('save',async function(next){
  if(!this.isModified){
    next();
  }

  const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt)
})

const User=mongoose.model("User",userSchema);
module.exports = User;