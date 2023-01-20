const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true0, unique: true },
    desc: { type: String },
    mainImg: { type: String },
    titleImg: { type: String },
    thumbnailImg: { type: String },
    trailer: { type: String },
    video: { type: String },
    year: { type: String },
    ageLimit: { type: Number },
    genre: { type: String },
    isSeries: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", MovieSchema);
