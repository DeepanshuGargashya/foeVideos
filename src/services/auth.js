import { Container, Service, Inject } from "typedi";
import jwt from "jsonwebtoken";
import logger from "../loaders/logger.js";
import OtpModel from "../models/otpModel.js";
import { MathUtil, ErrorHandler } from "../utility/index.js";
import sendMail from "../utility/sendMail.js";
import userModel from "../models/userModel.js";

export default class AuthService {
  async generateOtp(body) {
    logger.info("Generate OTP Service Start");
    var pin = MathUtil.getOTP();
    logger.debug("generated pin is %o", pin);
    logger.debug("body is %o ", body);
    var result = await OtpModel.create({
      email: body.emailId,
      pwd: body.password,
      otp: pin,
    })
      .then((value) => {
        logger.debug("created success %o", value);
        logger.info("generated otp success");
        sendMail("your foeVideos account OTP", pin, body.emailId);
        // return value;
        return `otp sent to ${body.emailId}`;
      })
      .catch((e) => {
        logger.debug("error in %o ", e);
        logger.error(e);

        throw e;
      });
    return result;
  }

  async verifyOtp(body) {
    logger.info("Verify OTP Service Start");

    logger.debug("body is %o ", body);
    var result = await OtpModel.findOne({ email: body.emailId, otp: body.otp })
      .then((value) => {
        if (value) {
          logger.debug("created success %o", value);
          logger.info("generated otp success");
          // sendMail("your foeVideos account OTP", pin, body.emailId);
          return userModel
            .create({
              email: value.email,
              pwd: value.pwd,
            })
            .then((value) => {
              return OtpModel.findOneAndDelete({
                email: body.emailId,
                otp: body.otp,
              })
                .then((delRes) => {
                  return value;
                })
                .catch((e) => {
                  throw new ErrorHandler.BadError(
                    "user not created, try again"
                  );
                });
            })
            .catch((e) => {
              throw new ErrorHandler.BadError("user not created, try again");
            });
        } else {
          throw new ErrorHandler.BadError("Invalid OTP");
        }
      })
      .catch((e) => {
        logger.debug("error in %o ", e);
        logger.error(e);

        throw e;
      });
    return result;
  }
}
Container.set("authService", new AuthService());
