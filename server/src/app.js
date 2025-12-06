const express = require("express");
const cors = require("cors");

const app = express();

// Core middlewares
app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.status(500).json({
    status: "running",
  });
});

module.exports = app;
