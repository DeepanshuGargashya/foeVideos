import express, { Router } from "express";
import path from "path";
import auth from "./routes/authSignup/index.js";
import videos from "./routes/videos/index.js";
import user from "./routes/user/index.js";

// export default () => {
const app = express();

app.use("/auth", auth);
app.use("/video", videos);
app.use("/user", user);
// app.use("/evideo", express.static(path.join(__dirname, "videos")));

export default app;
