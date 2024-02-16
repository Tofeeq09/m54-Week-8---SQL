// External Dependencies - From third-party packages.
require("dotenv").config();
const express = require("express");

// Internal Module Imports - From files within the project.
const bookRouter = require("./books/routes"); // From the books/routes.js file.
const Book = require("./books/model"); // From the books/model.js file.
const genreRouter = require("./genres/routes"); // From the genres/routes.js file.
const Genre = require("./genres/model"); // From the genres/model.js file.
const authorRouter = require("./authors/routes"); // From the authors/routes.js file.
const Author = require("./authors/model"); // From the authors/model.js file.
// const sequelize = require("./db/connection"); // Import the sequelize connection from the connection.js file.

// port - The port number on which the server will run or the default port number 5000.
const app = express();
const port = process.env.PORT || 5000;

// Middleware - To parse the request body as JSON.
app.use(express.json());

// Routes - Mount the bookRouter on the "/books" path.
app.use("/books", bookRouter);
// Routes - Mount the genreRouter on the "/genres" path.
app.use("/genres", genreRouter);
// Routes - Mount the authorRouter on the "/authors" path.
app.use("/authors", authorRouter);

// A async function to sync the tables in the database.
const syncTables = async () => {
  // Define relationships between the tables.
  Author.hasMany(Book);
  Book.belongsTo(Author);
  Genre.hasMany(Book);
  Book.belongsTo(Genre);

  await Author.sync();
  await Genre.sync();
  await Book.sync();

  // The sync() method in Sequelize is used to synchronize all defined models to the database.
  // When called on a specific model like Book, it creates the table if it doesn't exist, and does nothing if it already exists.
  // await sequelize.sync(); // sequelize.sync() - is equivalent to Book.sync() and Author.sync() and Genre.sync() but it syncs all the tables at once.
};

// The health check endpoint to check if the server is running.
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Server - Start the server on the specified port.
app.listen(port, () => {
  syncTables(); // Call the syncTables function to sync the tables.
  console.log(`Server is running on port ${port}`);
});
