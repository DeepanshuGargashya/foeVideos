import multer from "multer";
import { Joi } from "celebrate";

// var storage = ;
export default {
  upload: multer({
    storage: multer.diskStorage({
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      },
    }),
  }),

  videoValid: Joi.object({
    tag: Joi.array()
      .items(Joi.string())
      .min(1)
      .messages({
        "string.pattern.base": "tag is required",
      })
      .required(),

    video: Joi.any()

      .messages({
        "string.email": "video is required",
      })
      .required(),
  }),
};
