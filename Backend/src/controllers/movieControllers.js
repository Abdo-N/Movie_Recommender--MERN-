import Movie from "../models/Movie.js";
import Rating from "../models/Rating.js";

export async function getAllMovies(req, res) {
    try{
        let movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        console.error("Error fetching movies: ", error);   
        res.status(500).json({ error: error.message });
    }
}

export function createMovie(req, res) {
    //add a movie to the database
    //res.status(201).json({ message: "Movie created successfully" });
}

export function updateMovie(req, res) {
    //update a movie in the database
    //res.status(200).json({ message: "Movie updated successfully" });
}

export function deleteMovie(req, res) {
    //Delete a movie from the database
    //res.status(200).json({ message: "Movie deleted successfully" });
}

export function submitRating(req, res) {
    //Submit a rating
    //res.status(200).json({ message: "Rating submitted successfully" });
}

export async function getRecommendations(req, res) {
    try {
        const inputTitle = (req.params.title || req.query.title || "").trim();

        if (!inputTitle) {
            return res.status(400).json({ error: "Movie title is required" });
        }

        const escapedTitle = inputTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const directMatches = await Movie.find({
            title: { $regex: escapedTitle, $options: "i" },
        }).select("movieId title");

        const normalizeTitle = (value) =>
            value
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "");

        const normalizedInput = normalizeTitle(inputTitle);

        let matchedMovies = directMatches;

        if (normalizedInput && matchedMovies.length === 0) {
            const allMovies = await Movie.find().select("movieId title");

            matchedMovies = allMovies.filter((candidateMovie) => {
                const normalizedCandidate = normalizeTitle(candidateMovie.title);

                return (
                    normalizedCandidate.includes(normalizedInput) ||
                    normalizedInput.includes(normalizedCandidate)
                );
            });
        }

        if (matchedMovies.length === 0) {
            return res.status(404).json({ error: "No matching movies found" });
        }

        const seedMovieIds = matchedMovies.map((matchedMovie) => matchedMovie.movieId);
        const matchedSeedMovies = matchedMovies.map((matchedMovie) => ({
            movieId: matchedMovie.movieId,
            title: matchedMovie.title,
        }));

        const likedUsers = await Rating.aggregate([
            {
                $match: {
                    movieId: { $in: seedMovieIds },
                    rating: { $gte: 4 },
                },
            },
            {
                $group: {
                    _id: "$userId",
                },
            },
        ]);

        const likedUserIds = likedUsers.map((item) => item._id);

        if (likedUserIds.length === 0) {
            return res.status(200).json([]);
        }

        const filteredUsers = await Rating.aggregate([
            {
                $match: {
                    userId: { $in: likedUserIds },
                },
            },
            {
                $group: {
                    _id: "$userId",
                    ratedMovies: { $addToSet: "$movieId" },
                },
            },
            {
                $project: {
                    totalRatings: { $size: "$ratedMovies" },
                },
            },
            {
                $match: {
                    totalRatings: { $gte: 20 },
                },
            },
        ]);

        const similarUserIds = filteredUsers.map((item) => item._id);

        if (similarUserIds.length === 0) {
            return res.status(200).json([]);
        }

        const recommendations = await Rating.aggregate([
            {
                $match: {
                    userId: { $in: similarUserIds },
                    movieId: { $nin: seedMovieIds },
                    rating: { $gte: 4 },
                },
            },
            {
                $group: {
                    _id: "$movieId",
                    watchCount: { $sum: 1 },
                    averageRating: { $avg: "$rating" },
                },
            },
            {
                $sort: {
                    watchCount: -1,
                    averageRating: -1,
                },
            },
            {
                $limit: 10,
            },
            {
                $lookup: {
                    from: "movies",
                    localField: "_id",
                    foreignField: "movieId",
                    as: "movie",
                },
            },
            {
                $unwind: {
                    path: "$movie",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    movieId: "$_id",
                    title: "$movie.title",
                    watchCount: 1,
                    averageRating: { $round: ["$averageRating", 2] },
                },
            },
        ]);

        return res.status(200).json({
            matchedSeedMovies,
            likedUserIds,
            similarUserIds,
            recommendations,
        });
    } catch (error) {
        console.error("Error getting recommendations:", error);
        return res.status(500).json({ error: error.message });
    }
}