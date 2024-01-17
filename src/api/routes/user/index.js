import { Router } from "express";
import { celebrate, Segments } from "celebrate";
import validation from "./validation.js";
import controller from "./user.controller.js";
import isAuth from "../../middlewares/isAuth.js";
// export default (app) => {

const route = Router();

route.get(
  "/getUserDetail",
  celebrate({
    [Segments.QUERY]: validation.getUserDetail,
  }),
  isAuth,
  controller.getUserDetail
);
route.post(
  "/updateUserDetail",
  celebrate({
    [Segments.BODY]: validation.updateUserDetail,
  }),
  isAuth,
  controller.updateUserDetail
);
route.post(
  "/updateUserDetail/updateEmailSendOtp",
  celebrate({
    [Segments.BODY]: validation.updateEmailSendOtp,
  }),
  isAuth,
  controller.updateEmailGenerate
);
route.post(
  "/updateUserDetail/updateEmailVerifyOtp",
  celebrate({
    [Segments.BODY]: validation.updateEmailVerifyOtp,
  }),
  isAuth,
  controller.updateEmailVerify
);
export default route;
