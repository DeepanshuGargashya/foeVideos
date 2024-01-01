import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  mobile: {
    type: String,
    required: false,
    default: null,
  },
  dob: {
    type: String,
    required: false,
    default: null,
  },

  email: {
    type: String,
    required: false,
  },
});

const userModel = mongoose.model("user", UserModel);

export default userModel;
