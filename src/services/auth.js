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
    const userService = Container.get("userService");
    return await OtpModel.deleteMany({
      email: body.emailId,
    }).then(async (delRes) => {
      return await userService
        .checkUserExist(body.emailId)
        .then(async (userExist) => {
          if (!userExist) {
            return await OtpModel.create({
              name: body.name,
              email: body.emailId,

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
          } else {
            throw new ErrorHandler.BadError("user already exist");
          }
        })
        .catch((e) => {
          logger.debug("error in %o ", e);
          logger.error(e);

          throw e;
        });
    });
  }

  async verifyOtp(body) {
    logger.info("Verify OTP Service Start");

    logger.debug("body is %o ", body);
    var result = await OtpModel.findOne({ email: body.emailId, otp: body.otp })
      .then(async (value) => {
        if (value) {
          logger.debug("created success %o", value);
          logger.info("generated otp success");
          // sendMail("your foeVideos account OTP", pin, body.emailId);
          return await userModel
            .create({
              name: value.name,
              email: value.email,
            })
            .then(async (value) => {
              return await OtpModel.findOneAndDelete({
                email: body.emailId,
                otp: body.otp,
              })
                .then((delRes) => {
                  const updatedObject = {
                    userId: value._id,
                    ...value._doc,
                  };

                  // Optionally, omit the old field name
                  const { _id, __v, ...finalObject } = updatedObject;
                  return finalObject;
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
