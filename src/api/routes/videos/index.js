import { Router } from "express";
// import validation from "./validation.js";
import controller from "./video.controller.js";

// const upload = require("./validation.js");
import validation from "./validation.js";
import { celebrate } from "celebrate";
// export default (app) => {

const route = Router();

route.post(
  "/uploadVideo",
  validation.upload.single("video"),
  controller.saveVideo
);
route.get("/getVideos/:page?/:size?/:all?", [], controller.getVideos);
route.get("/getVideosByTag/:tag", [], controller.getVideosByTag);
// route.get("/videos/:filename", [], controller.getEachVideo);

export default route;
