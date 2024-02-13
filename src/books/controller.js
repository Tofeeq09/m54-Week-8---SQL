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

    if (!books.length) {
      res.status(404).json({ message: "No books found" });
      return;
    }

    let message = "All books";
    if (Object.keys(req.query).length) {
      message = "Filtered books";
    }
    // If no query req.query will be an empty object. Object.keys(req.query) will return an empty array, and Object.keys(req.query).length will return 0
    // 0 is considered a "falsy" value, which means it's treated as false in a boolean context. So if there are no query parameters, the message will be "All books".

    res.status(200).json({
      message: message,
      query: req.query,
      books: books,
    });
  } catch (error) {
    console.log("Error fetching books: ", error);
    res.status(500).json({ message: error.message, error: error });
  }
};

const deleteAllBooks = async (req, res) => {
  try {
    const result = await Book.destroy({ where: {} });
    if (result === 0) {
      res.status(404).json({
        message: "No books found to delete. The database is already empty.",
      });
      return;
    }
    res.status(200).json({
      message: `${result} books deleted. The database is now empty.`,
    });
  } catch (error) {
    console.log("Error deleting books: ", error);
    res
      .status(500)
      .json({ message: "Error deleting books", error: error.message });
  }
};

const getAllTitles = async (req, res) => {
  try {
    const books = await Book.findAll({
      attributes: ["title"],
      group: "title",
    });
    const titles = books.map((book) => book.title);
    if (titles.length === 0) {
      res.status(404).json({
        message: "No titles found",
      });
      return;
    }
    res.status(200).json(titles);
  } catch (error) {
    console.log("Error getting titles: ", error);
    res
      .status(500)
      .json({ message: "Error getting titles", error: error.message });
  }
};

// Export the controller functions as an object so they can be imported and used in routes.js.
module.exports = {
  addBooks,
  getAllOrQueryBooks,
  deleteAllBooks,
  getAllTitles,
  //   getBookByTitle,
  //   UpdateAllFieldsByTitle,
  //   deleteBookByTitle,
  //   getAllAuthors,
  //   getAllBooksFromAuthor,
  //   updateAuthorNameForAllBooks,
  //   deleteAllBooksByAuthor,
  //   getAllGenres,
  //   getAllBooksFromGenre,
  //   updateGenreForAllBooks,
  //   deleteAllBooksByGenre,
  //   getBookById,
  //   updateBookById,
  //   deleteBookById,
};
