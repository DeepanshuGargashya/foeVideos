// import { Request, Response, NextFunction } from "express";
import { APIResponse, ErrorHandler } from "../../../utility/index.js";
import logger from "../../../loaders/logger.js";
import { Container } from "typedi";
import VideoService from "../../../services/video.js";
import path, { dirname } from "path";
import fs from "fs";
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
    // return APIResponse.success(res, "Success", "success");
    const getVideoService = Container.get("videoService");
    console.log("service registered");
    return getVideoService
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
  getEachVideo: (req, res, next) => {
    console.log("entere cont start");
    const filename = req.params.filename;
    const filePath = path.join("./videos", filename);
    console.log(filePath);
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        // Serve partial content (range request)
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunksize = end - start + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4", // Adjust the content type based on your file type
        };

        res.writeHead(206, head);
        file.pipe(res);
      } else {
        // Serve whole content
        const head = {
          "Content-Length": fileSize,
          "Content-Type": "video/mp4", // Adjust the content type based on your file type
        };

        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
      }
    } else {
      // File not found
      return APIResponse.badRequest(res, "File Not Found", "");
    }
  },
};
