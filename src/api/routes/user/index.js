import { Router } from "express";
import { celebrate, Segments } from "celebrate";
import validation from "./validation.js";
import controller from "./user.controller.js";
// export default (app) => {

const route = Router();

route.get(
  "/getUserDetail",
  celebrate({
    [Segments.QUERY]: validation.getUserDetail,
  }),
  controller.getUserDetail
);
route.post(
  "/updateUserDetail",
  celebrate({
    [Segments.BODY]: validation.updateUserDetail,
  }),
  controller.updateUserDetail
);
route.post(
  "/updateUserDetail/updateEmailSendOtp",
  celebrate({
    [Segments.BODY]: validation.updateEmailSendOtp,
  }),
  controller.updateEmailGenerate
);
route.post(
  "/updateUserDetail/updateEmailVerifyOtp",
  celebrate({
    [Segments.BODY]: validation.updateEmailVerifyOtp,
  }),
  controller.updateEmailVerify
);
export default route;
