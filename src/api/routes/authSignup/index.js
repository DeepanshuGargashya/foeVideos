import { Router } from "express";
import { celebrate, Segments } from "celebrate";
import validation from "./validation.js";
import controller from "./auth.controller.js";
// export default (app) => {

const route = Router();

route.post(
  "/generate-otp",
  celebrate({
    [Segments.BODY]: validation.generateOTP,
  }),
  controller.generateOTP
);
route.post(
  "/verify-otp",
  celebrate({
    [Segments.BODY]: validation.verifyOTP,
  }),
  controller.verifyOTP
);
export default route;
