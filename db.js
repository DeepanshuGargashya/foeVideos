import mongoose from "mongoose";

mongoose
  .connect("mongodb://0.0.0.0:27017/foeVideos")
  .then(() => {
    console.log("Successfully started");
  })
  .catch(function (err) {
    console.log(err);
  });

export default mongoose;
