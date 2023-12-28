import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  pwd: {
    type: String,
    required: false,
  },
});

const userModel = mongoose.model("user", UserModel);

export default userModel;
