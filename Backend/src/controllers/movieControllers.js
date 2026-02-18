export function getAllMovies(req, res) {
    //Get all movies from database
    res.status(200).send("Hello World");
}

export function createMovie(req, res) {
    //add a movie to the database
    res.status(201).json({ message: "Movie created successfully" });
}

export function updateMovie(req, res) {
    //update a movie in the database
    res.status(200).json({ message: "Movie updated successfully" });
}

export function deleteMovie(req, res) {
    //Delete a movie from the database
    res.status(200).json({ message: "Movie deleted successfully" });
}

export function submitRating(req, res) {
    //Submit a rating
    res.status(200).json({ message: "Rating submitted successfully" });
}

export function getRecommendations(req, res) {
    //Get recommendations based on a movie title
    res.status(200).send("Hello World");
}


