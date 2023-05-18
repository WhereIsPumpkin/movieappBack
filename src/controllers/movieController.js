import Movie from "../models/movieModel.js";

export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({ movies });
  } catch (error) {
    console.error("Error getting movies:", error);
    res.status(500).json({ message: "Error getting movies" });
  }
};
