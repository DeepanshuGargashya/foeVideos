import { Container, Service, Inject } from "typedi";
import jwt from "jsonwebtoken";
import logger from "../loaders/logger.js";
import OtpModel from "../models/otpModel.js";
import { MathUtil, ErrorHandler, CustomUrl } from "../utility/index.js";
import sendMail from "../utility/sendMail.js";
import userModel from "../models/userModel.js";
import videoModel from "../models/videosModel.js";
import { CustomUrl as cloudinary, Pagination } from "../utility/index.js";

export default class VideoService {
  async getVideoByTag(req) {
    logger.info("Get Video Service Start");

    return videoModel
      .find({ tag: req.params.tag })
      .then((value) => {
        logger.debug("get video success %o", value);

        return value;
      })
      .catch((e) => {
        logger.debug("error in %o ", e);
        logger.error(e);

        throw e;
      });
  }

  async getVideos(query) {
    logger.info("Get Video Service Start");
    const { page, size, search } = query;
    const { limit, offset } = Pagination.getPagination(page, size);
    let tag;
    if (search) tag = new RegExp("^" + (search || ""), "i");

    return videoModel
      .find(tag ? { tag: tag } : {})
      .skip(offset)
      .limit(limit)
      .then((value) => {
        logger.debug("get video success %o", value);
        return videoModel
          .countDocuments(tag ? { tag: tag } : {})
          .then((totalDocs) => {
            const pages = Pagination.getPages(totalDocs, limit);
            return {
              totalItems: totalDocs,
              data: value,
              totalPages: pages,
              currentPage: page || 1,
            };
          });
      })
      .catch((e) => {
        logger.debug("error in %o ", e);
        logger.error(e);

        throw e;
      });
  }

  async saveVideo(body) {
    logger.info("save Video Service Start");
    logger.debug("the path of video is %o", body.file.path);

    return await cloudinary.uploader
      .upload(body.file.path, { resource_type: "video" })
      .then((result) => {
        // logger.debug("result is %o", result);
        // logger.debug("secure url is  %o", result.secure_url);
        // logger.debug("body tag is %o", body);
        // logger.debug("body tag is %o", body.body.tag);
        // var url = CustomUrl(result.secure_url, "customValue");
        // logger.debug("custom url is %o", url);
        videoModel
          .create({ tag: body.body.tag, vid: result.secure_url })
          .then((res) => {
            return res;
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  }
}
Container.set("videoService", new VideoService());
