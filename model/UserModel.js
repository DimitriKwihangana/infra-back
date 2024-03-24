const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    location:{
        type:String,
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
