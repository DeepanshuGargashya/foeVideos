import mongoose from "mongoose";

const VideoModel = new mongoose.Schema({
  vid: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  tag: {
    type: [String],
    required: true,
  },
});

const videoModel = mongoose.model("videos", VideoModel);

export default videoModel;
