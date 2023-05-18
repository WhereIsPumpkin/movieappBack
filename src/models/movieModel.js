import mongoose from "mongoose";

const thumbnailSchema = new mongoose.Schema({
  trending: {
    small: String,
    large: String,
  },
  regular: {
    small: String,
    medium: String,
    large: String,
  },
});

const movieSchema = new mongoose.Schema({
  title: String,
  thumbnail: thumbnailSchema,
  year: Number,
  category: String,
  rating: String,
  isBookmarked: Boolean,
  isTrending: Boolean,
});

const Movie = mongoose.model("Movie", movieSchema, "datas");

export default Movie;
