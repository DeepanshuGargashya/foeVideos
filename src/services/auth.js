import { Container, Service, Inject } from "typedi";
import jwt from "jsonwebtoken";
import logger from "../loaders/logger.js";
import OtpModel from "../models/otpModel.js";
import { MathUtil, ErrorHandler } from "../utility/index.js";
import sendMail from "../utility/sendMail.js";
import userModel from "../models/userModel.js";

export default class AuthService {
  JWT_SECRET = "p4sta.w1th-b0logn3s3-s@uce";
  JWT_ALGO = "HS256";
  async generateOtp(body) {
    logger.info("Generate OTP Service Start");
    var pin = MathUtil.getOTP();
    logger.debug("generated pin is %o", pin);
    logger.debug("body is %o ", body);

    return await OtpModel.deleteMany({
      email: body.emailId,
    }).then(async (delRes) => {
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

      // })
    });
  }

  async verifyOtp(body) {
    logger.info("Verify OTP Service Start");

    logger.debug("body is %o ", body);
    const userService = Container.get("userService");
    var result = await OtpModel.findOne({ email: body.emailId, otp: body.otp })
      .then(async (value) => {
        if (value) {
          logger.debug("created success %o", value);
          logger.info("generated otp success");
          // sendMail("your foeVideos account OTP", pin, body.emailId);
          return await userService
            .checkUserExist(body.emailId)
            .then(async (userExist) => {
              if (!userExist) {
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

                        return {
                          token: this.generateToken(finalObject),
                          // ...finalObject,
                        };
                      })
                      .catch((e) => {
                        throw new ErrorHandler.BadError(
                          "user not created, try again"
                        );
                      });
                  })
                  .catch((e) => {
                    throw new ErrorHandler.BadError(
                      "user not created, try again"
                    );
                  });
              } else {
                return await OtpModel.findOneAndDelete({
                  email: body.emailId,
                  otp: body.otp,
                })
                  .then(async (delRes) => {
                    console.log("dele res");
                    console.log(delRes);
                    return await userModel
                      .findOne({ email: body.emailId })
                      .then((value) => {
                        if (value) {
                          console.log(value);
                          const updatedObject = {
                            userId: value._id,
                            ...value._doc,
                          };

                          // Optionally, omit the old field name
                          const { _id, __v, ...finalObject } = updatedObject;
                          return {
                            token: this.generateToken(finalObject),
                            // ...finalObject,
                          };
                        } else {
                          throw new ErrorHandler.BadError(
                            "user not exist, try again"
                          );
                        }
                      })
                      .catch((e) => {
                        throw new ErrorHandler.BadError(
                          "user not exist, try again"
                        );
                      });
                  })
                  .catch((e) => {
                    throw new ErrorHandler.BadError(
                      "user not created, try again"
                    );
                  });
              }
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

  generateToken(user) {
    console.log("succes in auth.js ");

    const today = new Date();
    console.log("succes in today");
    const exp = new Date(today);
    console.log("succes in exp");
    exp.setDate(today.getDate() + 60);
    console.log("succes in exp.setDate done");

    /**
     * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
     * The cool thing is that you can add custom properties a.k.a metadata
     * Here we are adding the userId, role and name
     * Beware that the metadata is public and can be decoded without _the secret_
     * but the client cannot craft a JWT to fake a userId
     * because it doesn't have _the secret_ to sign it
     * more information here: https://softwareontheroad.com/you-dont-need-passport
     */
    logger.info(`Sign JWT for userId: ${user.userId}`);
    return jwt.sign(
      {
        userId: user.userId, // We are gonna use this in the middleware 'isAuth'
        name: user.name,
        dob: user.dob,
        mobile: user.mobile,
        email: user.email,
        exp: exp.getTime() / 1000,
      },
      this.JWT_SECRET
    );
  }
  generateTokentest(user) {
    console.log(user);
    console.log(this.JWT_SECRET);
    return;
  }
}
Container.set("authService", new AuthService());
