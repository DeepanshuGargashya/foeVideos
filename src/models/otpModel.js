import mongoose from "mongoose";

const OTPModel = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },

  email: {
    type: String,
    required: true,
  },
  newEmail: {
    type: String,
    required: false,
  },

  upEmail: {
    type: Boolean,
    required: false,
    default: false,
  },

  otp: {
    type: String,
    required: true,
  },
});

const otpModel = mongoose.model("OTP", OTPModel);

export default otpModel;
