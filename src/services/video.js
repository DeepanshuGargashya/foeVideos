import { Container } from "typedi";
import logger from "../loaders/logger.js";
import { cloudinary, Pagination, CustomUrl } from "../utility/index.js";
import videoModel from "../models/videosModel.js";

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
  secondsToHHMMSS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
  async saveVideo(body) {
    logger.info("save Video Service Start");
    logger.debug("the path of video is %o", body.file.path);

    return await cloudinary.uploader
      .upload(body.file.path, { resource_type: "video" })
      .then(async (result) => {
        // logger.debug("result is %o", result);
        // logger.debug("secure url is  %o", result.secure_url);
        // logger.debug("body tag is %o", body);
        // logger.debug("body tag is %o", body.body.tag);
        // var url = CustomUrl(result.secure_url, "customValue");
        // logger.debug("custom url is %o", url);
        // console.log(result.access_control);
        // console.log(result.access_mode);
        // console.log(result.bytes); // size in bytes (for mb we can use (bytes/1024)/1024)
        // console.log(result.colors);
        // console.log(result.context);
        // console.log(result.created_at); // gives created date and time stamp
        // console.log(result.etag); // give some unique id
        // console.log(result.format); // gives format of video
        // console.log(result.height); // gives print
        // console.log(result.metadata);
        // console.log(result.moderation);
        // console.log(result.original_filename); // gives file name
        // console.log(result.pages); // return 0 because there is no page in video
        // console.log(result.placeholder); // give false
        // console.log(result.public_id); // give unique od
        // console.log(result.resource_type); // give that it is video or image
        // console.log(result.signature); // give some unique id ( it is also called signature id)
        // console.log(result.secure_url); // return https url which is used to access the media
        // console.log(result.tags); // return tags
        // console.log(result.type); // returns upload or whatever
        // console.log(result.url); // return http url which is used to access the media
        // console.log(result.version);
        // console.log(result.width); // gives width of image
        console.log(result.duration); // gives width of image
        return await videoModel
          .create({
            tag: body.body.tag,
            vid: result.secure_url,
            title: body.body.title,
            size: result.bytes,
            createdAt: result.created_at,
            timeStamp: this.secondsToHHMMSS(result.duration),
          })
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
