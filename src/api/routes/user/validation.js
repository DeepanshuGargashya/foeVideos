import { Joi } from "celebrate";
export default {
  getUserDetail: Joi.object({
    userId: Joi.string().required().min(24).max(24).messages({
      "string.pattern.base": "userId is required",
    }),
  }),
  updateUserDetail: Joi.object({
    userId: Joi.string().required().min(24).max(24).messages({
      "string.pattern.base": "userId is required",
    }),
    name: Joi.string()
      .messages({
        "string.pattern.base": "name is required",
      })
      .required(),
    mobile: Joi.string()
      .messages({
        "string.pattern.base": "mobile is required",
      })
      .required(),
    dob: Joi.string()
      .messages({
        "string.pattern.base": "dob is required",
      })
      .required(),
  }),

  updateEmailSendOtp: Joi.object({
    emailId: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .messages({
        "string.email": "Invalid email",
      })
      .required(),

    userId: Joi.string().required().min(24).max(24).messages({
      "string.pattern.base": "user is not valid",
    }),
  }),
  updateEmailVerifyOtp: Joi.object({
    otp: Joi.string()
      .min(4)
      .max(4)
      .messages({
        "string.pattern.base": "Invalid otp",
      })
      .required(),

    userId: Joi.string().required().min(24).max(24).messages({
      "string.pattern.base": "user is not valid",
    }),
  }),
};
// export default { generateOTP };
