// External Dependencies - From third-party packages.
require("dotenv").config();
const express = require("express");

// Internal Module Imports - From files within the project.
// const sequelize = require("./db/connection"); // From the connection.js file
const bookRouter = require("./books/routes"); // From the routes.js file
const Book = require("./books/model"); // From the model.js file.

// port - The port number on which the server will run or the default port number 5000.
const app = express();
const port = process.env.PORT || 5000;

// Middleware - To parse the request body as JSON.
app.use(express.json());

// A async function to sync the tables. This will create the tables if they do not exist.
const syncTables = async () => {
  await Book.sync();
};

// The health check endpoint to check if the server is running.
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Routes - Mount the bookRouter on the "/books" path.
app.use("/books", bookRouter);

// Server - Start the server on the specified port.
app.listen(port, () => {
  syncTables(); // Call the syncTables function to sync the tables.
  console.log(`Server is running on port ${port}`);
});
