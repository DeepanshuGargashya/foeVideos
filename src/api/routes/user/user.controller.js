import { APIResponse, ErrorHandler } from "../../../utility/index.js";
import logger from "../../../loaders/logger.js";
import { Container } from "typedi";
import UserService from "../../../services/user.js";

export default {
  getUserDetail: (req, res, next) => {
    logger.info("Get user detail Start");

    logger.debug("Get user detail input body: %o", req.query);

    const getUserDetailService = Container.get("userService");
    getUserDetailService
      .getUserDetail(req.query.userId)
      .then((result) => {
        logger.info("Get user detail end with success.", result);
        console.log("result", result);
        if (result) {
          return APIResponse.success(res, "Success", result);
        }
        return APIResponse.notFound(res, "user not found", {});
      })
      .catch((e) => {
        if (e instanceof ErrorHandler.BadError) {
          return APIResponse.badRequest(res, e.message, "");
        } else {
          logger.error("Get user detail with error.", e);
          return next(e);
          // return APIResponse.badRequest(res, "Something went wrong", "");
        }
      });
  },
  updateUserDetail: (req, res, next) => {
    logger.info("update user detail Start");

    logger.debug("update user detail input body: %o", req.body);

    const updateUserDetailService = Container.get("userService");
    updateUserDetailService
      .updateUserDetail(req.body)
      .then((result) => {
        logger.info("update user detail end with success.", result);
        console.log("result", result);
        if (result) {
          return APIResponse.success(res, "Success", result);
        }
        return APIResponse.notFound(res, "user not found", {});
      })
      .catch((e) => {
        if (e instanceof ErrorHandler.BadError) {
          return APIResponse.badRequest(res, e.message, "");
        } else {
          logger.error("update user detail with error.", e);
          return next(e);
          // return APIResponse.badRequest(res, "Something went wrong", "");
        }
      });
  },

  updateEmailGenerate: (req, res, next) => {
    logger.info("Generate OTP Start");
    logger.debug("Generate otp input body: %o", req.body);

    const generateOTPService = Container.get("userService");
    generateOTPService
      .generateOtpUpdateEmail(req.body)
      .then((result) => {
        if (result) {
          logger.info("Generate otp end with success.", result);
          return APIResponse.success(res, "Success", result);
        } else {
          return APIResponse.notFound(res, "User not found", result);
        }
      })
      .catch((e) => {
        if (e instanceof ErrorHandler.BadError) {
          return APIResponse.badRequest(res, e.message, "");
        } else {
          logger.error("Generate otp end with error.", e);
          return next(e);
          // return APIResponse.badRequest(res, "Something went wrong", "");
        }
      });
  },
  updateEmailVerify: async (req, res, next) => {
    try {
      logger.info("verify OTP Start");
      // console.log("generate log1");
      logger.debug("Generate otp input body: %o", req);
      // console.log(req);
      // console.log("generate log2");

      const verifyOTPService = Container.get("userService");
      const verifyOTPInfo = await verifyOTPService.verifyOtpUpdateEmail(
        req.body
      );
      if (verifyOTPInfo) {
        logger.info("Verify otp end with success.", verifyOTPInfo);
        return APIResponse.success(res, "Success", verifyOTPInfo);
      } else {
        return APIResponse.notFound(res, "please request first", {});
      }
    } catch (e) {
      if (e instanceof ErrorHandler.BadError) {
        return APIResponse.badRequest(res, e.message, "");
      } else {
        logger.error("verify otp end with error.", e);
        return next(e);
        // return APIResponse.badRequest(res, "Something went wrong", "");
      }
    }
  },
};
