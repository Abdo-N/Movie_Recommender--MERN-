import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        const dbName = (process.env.MONGO_DB_NAME).trim();

        if (dbName.includes(".")) {
            throw new Error("MONGO_DB_NAME is invalid. Use only the DB name, e.g. movies");
        }

        await mongoose.connect(process.env.MONGO_URI, { dbName });

        console.log(`Connected to the database successfully: ${mongoose.connection.name}`);
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
}