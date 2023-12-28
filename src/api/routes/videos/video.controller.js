// import { Request, Response, NextFunction } from "express";
import { APIResponse, ErrorHandler } from "../../../utility/index.js";
import logger from "../../../loaders/logger.js";
import { Container } from "typedi";
import VideoService from "../../../services/video.js";

export default {
  getVideos: (req, res, next) => {
    logger.info("Get video Start");
    // console.log("generate log1");
    // logger.debug("Generate otp input body: %o", req);
    // console.log(req);
    // console.log("generate log2");
    const { page, size, all } = req.params;
    const { search } = req.query;
    const input = {
      search,
      page: parseInt(page),
      size: all ? 1000 : parseInt(size),
    };
    logger.debug("input is %o", input);

    const getVideoService = Container.get("videoService");
    console.log("service registered");
    getVideoService
      .getVideos(input)
      .then((result) => {
        logger.info("Get video end with success.", result);
        return APIResponse.success(res, "Success", result);
      })
      .catch((e) => {
        if (e instanceof ErrorHandler.BadError) {
          return APIResponse.badRequest(res, e.message, "");
        } else {
          logger.error("Get otp end with error.", e);
          return next(e);
          // return APIResponse.badRequest(res, "Something went wrong", "");
        }
      });
  },
  getVideosByPage: (req, res, next) => {
    logger.info("Get video Start");
    // console.log("generate log1");
    // logger.debug("Generate otp input body: %o", req);
    // console.log(req);
    // console.log("generate log2");

    const getVideoService = Container.get("videoService");
    console.log("service registered");
    getVideoService
      .getVideosByPage(req.params.page)
      .then((result) => {
        logger.info("Get video end with success.", result);
        return APIResponse.success(res, "Success", result);
      })
      .catch((e) => {
        if (e instanceof ErrorHandler.BadError) {
          return APIResponse.badRequest(res, e.message, "");
        } else {
          logger.error("Get otp end with error.", e);
          return next(e);
          // return APIResponse.badRequest(res, "Something went wrong", "");
        }
      });
  },

  getVideosByTag: (req, res, next) => {
    logger.info("Get video by tag Start");
    logger.debug("Get video by tag params %o", req.params.tag);

    const getVideoService = Container.get("videoService");
    console.log("service registered");
    getVideoService
      .getVideoByTag(req)
      .then((result) => {
        logger.info("Get video end with success.", result);
        return APIResponse.success(res, "Success", result);
      })
      .catch((e) => {
        if (e instanceof ErrorHandler.BadError) {
          return APIResponse.badRequest(res, e.message, "");
        } else {
          logger.error("Get otp end with error.", e);
          return next(e);
          // return APIResponse.badRequest(res, "Something went wrong", "");
        }
      });
  },

  saveVideo: (req, res, next) => {
    logger.info("Save video Start");

    const getVideoService = Container.get("videoService");
    console.log("service registered");
    getVideoService
      .saveVideo(req)
      .then((result) => {
        logger.info("save video end with success.", result);
        return APIResponse.success(res, "Success", result);
      })
      .catch((e) => {
        if (e instanceof ErrorHandler.BadError) {
          return APIResponse.badRequest(res, e.message, "");
        } else {
          logger.error("save video end with error.", e);
          return next(e);
          // return APIResponse.badRequest(res, "Something went wrong", "");
        }
      });
  },
};
