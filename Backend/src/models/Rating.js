import mongoose from "mongoose";

const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId:    { type: Number, required: true },
  movieId:   { type: Number, required: true },
  rating:    { type: Number, required: true, min: 0.5, max: 5 },
}, {timestamps: true});

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;