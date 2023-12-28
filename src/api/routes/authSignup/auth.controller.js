// import { Request, Response, NextFunction } from "express";
import { APIResponse, ErrorHandler } from "../../../utility/index.js";
import logger from "../../../loaders/logger.js";
import { Container } from "typedi";
import AuthService from "../../../services/auth.js";

export default {
  generateOTP: (req, res, next) => {
    logger.info("Generate OTP Start");
    console.log("generate log1");
    logger.debug("Generate otp input body: %o", req);
    console.log(req);
    console.log("generate log2");

    const generateOTPService = Container.get("authService");
    generateOTPService
      .generateOtp(req.body)
      .then((result) => {
        logger.info("Generate otp end with success.", result);
        return APIResponse.success(res, "Success", result);
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
  verifyOTP: async (req, res, next) => {
    try {
      logger.info("verify OTP Start");
      // console.log("generate log1");
      logger.debug("Generate otp input body: %o", req);
      // console.log(req);
      // console.log("generate log2");

      const verifyOTPService = Container.get("authService");
      const verifyOTPInfo = await verifyOTPService.verifyOtp(req.body);
      logger.info("Verify otp end with success.", verifyOTPInfo);
      return APIResponse.success(res, "Success", verifyOTPInfo);
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
