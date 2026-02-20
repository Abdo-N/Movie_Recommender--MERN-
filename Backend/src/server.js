import express from "express";
import apiRoutes from "./routes/apiRoutes.js";
import { connectDB } from "./Config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use("/api", apiRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port: ",PORT);
});