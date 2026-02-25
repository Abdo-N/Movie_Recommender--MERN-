import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    movieId: { type: Number, required: true, unique: true },
  },
    {timestamps: true, collection: "movies"}
);


const Movie = mongoose.model("Movie", movieSchema);

export default Movie;