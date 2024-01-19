import { Container } from "typedi";
import logger from "../loaders/logger.js";
import sendMail from "../utility/sendMail.js";
import { MathUtil, ErrorHandler } from "../utility/index.js";
import userModel from "../models/userModel.js";
import OtpModel from "../models/otpModel.js";
import AuthService from "./auth.js";

export default class UserService {
  getUserDetail(userId) {
    logger.info("Get user detail Service Start");

    logger.debug("body is %o ", userId);
    var result = userModel
      .findById(userId, { __v: 0 })
      .then((value) => {
        if (value) {
          logger.debug("get success %o", value);
          logger.info("Get user detail success");
          const updatedObject = {
            userId: value._id,
            ...value._doc,
          };

          // Optionally, omit the old field name
          const { _id, ...finalObject } = updatedObject;
          return finalObject;
        } else {
          return null;
        }
      })
      .catch((e) => {
        logger.debug("error in %o ", e);
        logger.error(e);

        throw e;
      });
    return result;
  }
  updateUserDetail(body) {
    logger.info("Get user detail Service Start");

    logger.debug("body is %o ", body);
    var result = userModel
      .findByIdAndUpdate(body.userId, body)
      .then((value) => {
        if (value) {
          logger.debug("get success %o", value);
          logger.info("Get user detail success");
          //   const updatedObject = {
          //     userId: value._id,
          //     ...value._doc,
          //   };

          //   // Optionally, omit the old field name
          //   const { _id, ...finalObject } = updatedObject;
          return "update successfully";
        } else {
          return null;
        }
      })
      .catch((e) => {
        logger.debug("error in %o ", e);
        logger.error(e);

        throw e;
      });
    return result;
  }

  async generateOtpUpdateEmail(body) {
    logger.info("Generate OTP Service Start");
    var pin = MathUtil.getOTP();
    logger.debug("generated pin is %o", pin);
    logger.debug("body is %o ", body);
    return await userModel
      .findById({ _id: body.userId })
      .then(async (value) => {
        if (value) {
          console.log("userid is ", value.email);
          return await OtpModel.deleteMany({
            email: value.email,
          })
            .then(async (delRes) => {
              return await OtpModel.create({
                email: value.email,
                newEmail: body.newEmail,
                upEmail: true,
                otp: pin,
              })
                .then((value) => {
                  logger.debug("created success %o", value);
                  logger.info("generated otp success");
                  sendMail("your foeVideos account OTP", pin, value.email);
                  // return value;
                  return `otp sent to ${value.email}`;
                })
                .catch((e) => {
                  logger.debug("error in %o ", e);
                  logger.error(e);

                  throw e;
                });
            })
            .catch((e) => {});
        } else {
          return null;
        }
      })
      .catch((e) => {
        logger.debug("error in %o ", e);
        logger.error(e);

        throw e;
      });
  }

  async verifyOtpUpdateEmail(body) {
    logger.info("Verify OTP Service Start");
    var pin = MathUtil.getOTP();
    logger.debug("generated pin is %o", pin);
    logger.debug("body is %o ", body);
    return await userModel
      .findById(body.userId)
      .then((userRes) => {
        logger.debug("success to get user response %o ", userRes);
        if (userRes) {
          return OtpModel.findOneAndUpdate(
            {
              email: userRes.email,
              otp: body.otp,
              upEmail: true,
            },
            { otp: pin }
          )
            .then((value) => {
              if (value) {
                logger.debug("get otp result success %o", value);
                logger.info("verify otp success");
                // sendMail("your foeVideos account OTP", pin, body.emailId);
                sendMail(
                  "your foeVideos verify account OTP",
                  pin,
                  value.newEmail
                );
                // return value;
                return `otp sent to ${value.newEmail}`;
              } else {
                throw new ErrorHandler.BadError("Invalid OTP");
              }
            })
            .catch((e) => {
              logger.debug("error in %o ", e);
              logger.error(e);

              throw e;
            });
        } else {
          logger.info("error return null");
          return null;
        }
      })
      .catch((e) => {
        logger.debug("error in %o ", e);
        logger.error(e);

        throw e;
      });
  }

  async verifyOtpUpdateNewEmail(body) {
    logger.info("Verify OTP Service Start");

    logger.debug("body is %o ", body);
    return await userModel
      .findById(body.userId)
      .then((userRes) => {
        logger.debug("success to get user response %o ", userRes);
        if (userRes) {
          return OtpModel.findOne({
            email: userRes.email,
            otp: body.otp,
            upEmail: true,
          })
            .then((value) => {
              if (value) {
                logger.debug("get otp result success %o", value);
                logger.info("verify otp success");
                // sendMail("your foeVideos account OTP", pin, body.emailId);
                return userModel
                  .findOneAndUpdate(
                    {
                      email: userRes.email,
                    },
                    { email: value.newEmail }
                  )
                  .then((value) => {
                    logger.info("update detail success");
                    return OtpModel.findOneAndDelete({
                      email: userRes.email,
                      otp: body.otp,
                    })
                      .then((delRes) => {
                        return "email updated successfully";
                      })
                      .catch((e) => {
                        throw new ErrorHandler.BadError("timeout for request");
                      });
                  })
                  .catch((e) => {
                    throw new ErrorHandler.BadError(
                      "user not found with this email, try again"
                    );
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
        } else {
          logger.info("error return null");
          return null;
        }
      })
      .catch((e) => {
        logger.debug("error in %o ", e);
        logger.error(e);

        throw e;
      });
  }

  async checkUserExist(email) {
    return await userModel
      .findOne({
        email: email,
      })
      .then((value) => {
        if (value) {
          return true;
        } else {
          return false;
        }
      })
      .catch((e) => {
        logger.debug("error in %o ", e);
        logger.error(e);

        throw e;
      });
  }
  async createUser(body) {
    console.log("body is ", body);
    return await this.checkUserExist(body.emailId)
      .then(async (userExist) => {
        if (!userExist) {
          return await userModel
            .create({
              name: body.name,
              email: body.emailId,
            })
            .then((value) => {
              const updatedObject = {
                userId: value._id,
                ...value._doc,
              };

              // Optionally, omit the old field name
              const { _id, __v, ...finalObject } = updatedObject;
              const authService = Container.get("authService");
              // authService.generateTokentest(finalObject);
              return {
                token: authService.generateToken(finalObject),
                // ...finalObject,
              };
            })
            .catch((e) => {
              logger.debug("error in %o ", e);
              logger.error(e);

              throw e;
            });
        } else {
          return await userModel
            .findOne({ email: body.emailId })
            .then((value) => {
              if (value) {
                console.log("value");
                console.log(value);
                const updatedObject = {
                  userId: value._id,
                  ...value._doc,
                };

                // Optionally, omit the old field name
                const { _id, __v, ...finalObject } = updatedObject;
                const authService = Container.get("authService");
                // authService.generateTokentest(finalObject);
                return {
                  token: authService.generateToken(finalObject),
                  // ...finalObject,
                };
              } else {
                throw new ErrorHandler.BadError("user not exist, try again");
              }
            })
            .catch((e) => {
              throw new ErrorHandler.BadError("user not exist, try again");
            });
        }
      })
      .catch((e) => {
        logger.debug("error in %o ", e);
        logger.error(e);

        throw e;
      });
  }
}
Container.set("userService", new UserService());
