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
        "string.base": "tag should be a string",
        "any.required": "tag is required",
      })
      .required(),
    title: Joi.string().required().messages({
      "string.base": "title should be a string",
      "any.required": "title is required",
    }),

    video: Joi.any()

      .messages({
        "string.email": "video is required",
      })
      .required(),
  }),
};
