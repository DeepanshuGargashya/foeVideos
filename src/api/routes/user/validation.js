import { Joi } from "celebrate";
export default {
  getUserDetail: Joi.object({
    // userId: Joi.string().required().min(24).max(24).messages({
    //   "string.pattern.base": "user is not valid",
    //   "any.required": "userId is required",
    // }),
  }),
  updateUserDetail: Joi.object({
    // userId: Joi.string().required().min(24).max(24).messages({
    //   "string.base": "userId should be string",
    //   "string.pattern.base": "userId is not valid",
    //   "any.required": "userId is required",
    // }),
    name: Joi.string()
      .messages({
        "string.base": "name should be string",

        "any.required": "name is required",
      })
      .required(),
    mobile: Joi.string()
      .messages({
        "string.base": "mobile should be string",

        "any.required": "mobile is required",
      })
      .required(),
    dob: Joi.string()
      .messages({
        "string.base": "dob should be string",

        "any.required": "dob is required",
      })
      .required(),
  }),

  updateEmailSendOtp: Joi.object({
    newEmail: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .messages({
        "string.email": "Invalid email",
      })
      .required(),

    // userId: Joi.string().required().min(24).max(24).messages({
    //   "string.pattern.base": "user is not valid",

    //   "any.required": "userId is required",
    // }),
  }),
  updateEmailVerifyOtp: Joi.object({
    otp: Joi.string().min(5).max(5).required().messages({
      "string.pattern.base": "Invalid otp",
    }),

    // userId: Joi.string().required().min(24).max(24).messages({
    //   "string.pattern.base": "user is not valid",

    //   "any.required": "userId is required",
    // }),
  }),
};
// export default { generateOTP };
