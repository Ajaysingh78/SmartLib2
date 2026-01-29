import express from "express";
import cors from "cors";
import connectDB from "./config/connectDB.js";
const app = express();

import dotenv from 'dotenv';
dotenv.config();

// middleware
app.use(express.json());
app.use(cors());

// connect DB
connectDB()


app.get("/", (req, res) => {
    res.send("API running 🚀");
});

export default app;