import celebrate, { Joi } from "celebrate";
import { ErrorHandler } from "../../../utility/index.js";
export default {
  generateOTP: Joi.object({
    password: Joi.string()
      .min(8)
      .messages({
        "string.pattern.base": "Invalid pass",
      })
      .required(),

    emailId: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .messages({
        "string.email": "Invalid email",
      })
      .required(),

    name: Joi.string().optional(),
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
