import celebrate, { Joi } from "celebrate";
import { ErrorHandler } from "../../../utility/index.js";
export default {
  generateOTP: Joi.object({
    googleAuth: Joi.boolean()

      .required()
      .messages({
        "string.base": "googleAuth should be a string",
        "any.required": "googleAuth is required",
      }),

    emailId: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .messages({
        "string.email": "Invalid email",
      })
      .required(),

    name: Joi.string().required().messages({
      "string.base": "name should be a string",
      "any.required": "name is required",
    }),
  }),
  verifyOTP: Joi.object({
    otp: Joi.string()
      .min(4)
      .max(4)
      .messages({
        "string.pattern.base": "Invalid otp",
      })
      .required(),

    emailId: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .messages({
        "string.email": "Invalid email",
      })
      .required(),
  }),
};
// export default { generateOTP };
