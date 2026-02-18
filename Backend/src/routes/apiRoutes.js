import express from "express";
const router = express.Router();
import {
	getAllMovies,
	createMovie,
	updateMovie,
	deleteMovie,
	submitRating,
	getRecommendations,
} from "../controllers/movieControllers.js";

router.get("/movies", getAllMovies);

router.post("/movies", createMovie);

router.put("/movies/:id", updateMovie);

router.delete("/movies/:id", deleteMovie);

router.post("/ratings", submitRating);

router.get("/recommend/:title", getRecommendations);

export default router;