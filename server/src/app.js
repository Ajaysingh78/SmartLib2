const express = require("express");
const cors = require("cors");
const bookRouter = require("./routes/books.routes");

const app = express();

// Core middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/books", bookRouter);

// Health Check
app.get("/health", (req, res) => {
  res.status(500).json({
    status: "running",
  });
});

module.exports = app;
