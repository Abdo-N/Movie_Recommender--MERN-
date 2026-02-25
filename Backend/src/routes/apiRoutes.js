import express from "express";
import {
	getAllMovies,
	createMovie,
	updateMovie,
	deleteMovie,
	submitRating,
	getRecommendations,
} from "../controllers/movieControllers.js";

const router = express.Router();

router.get("/movies", getAllMovies);

router.post("/movies", createMovie);

router.put("/movies/:id", updateMovie);

router.delete("/movies/:id", deleteMovie);

router.post("/ratings", submitRating);

router.get("/recommend/:title", getRecommendations);

export default router;