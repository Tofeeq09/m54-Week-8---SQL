// Internal Module Imports - From files within the project.
const Book = require("./model"); // Import the Book model from the model.js file.

// Controller Functions - Define the route handlers.
const addBooks = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const newBooks = await Book.bulkCreate(
        req.body.map((book) => ({
          title: book.title,
          author: book.author,
          genre: book.genre,
        }))
      );
      const bookTitles = newBooks.map((book) => book.title).join(", ");
      res
        .status(201)
        .json({ message: `Books added: ${bookTitles}`, books: newBooks });
      return;
    }
    const newBook = await Book.create({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
    });
    res
      .status(201)
      .json({ message: `Book added: ${req.body.title}`, book: newBook });
  } catch (error) {
    console.log("Error adding book: ", error);
    res.status(500).json({ message: error.message, error: error });
  }
};

const getAllOrQueryBooks = async (req, res) => {
  try {
    const books = await Book.findAll({ where: req.query });

    // If no query req.query will be an empty object. Object.keys(req.query) will return an empty array, and Object.keys(req.query).length will return 0
    // 0 is considered a "falsy" value, which means it's treated as false in a boolean context
    const message = Object.keys(req.query).length
      ? "Filtered books"
      : "All books";

    res.status(200).json({ message: message, books: books });
  } catch (error) {
    console.log("Error fetching books: ", error);
    res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
};

// Export the controller functions as an object so they can be imported and used in routes.js.
module.exports = {
  addBooks,
  getAllOrQueryBooks,
  //   deleteAllBooks,
  //   /////////////////////////////////////////////
  //   getAllTitles,
  //   getBookByTitle,
  //   UpdateAllFieldsByTitle,
  //   deleteBookByTitle,
  //   /////////////////////////////////////////////
  //   getAllAuthors,
  //   getAllBooksFromAuthor,
  //   updateAuthorNameForAllBooks,
  //   deleteAllBooksByAuthor,
  //   /////////////////////////////////////////////
  //   getAllGenres,
  //   getAllBooksFromGenre,
  //   updateGenreForAllBooks,
  //   deleteAllBooksByGenre,
  //   /////////////////////////////////////////////
  //   getBookById,
  //   updateBookById,
  //   deleteBookById,
  /////////////////////////////////////////////
};
