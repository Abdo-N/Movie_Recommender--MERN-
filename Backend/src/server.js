import express from "express";
import apiRoutes from "./routes/apiRoutes.js";

const app = express();

app.use("/api", apiRoutes);

app.listen(5001, () => {
    console.log("Server is running on port 5001");
});