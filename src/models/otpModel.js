import mongoose from "mongoose";

const OTPModel = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  pwd: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },
});

const otpModel = mongoose.model("OTP", OTPModel);

export default otpModel;
