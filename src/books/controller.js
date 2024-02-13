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
    console.log(
      `Error in 'addBooks' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        handler: "addBooks",
        message: "Error adding books",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        errorMessage: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    });
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

    res.status(200).json({
      message: message,
      query: req.query,
      books: books,
    });
  } catch (error) {
    console.log(
      `Error in 'getAllOrQueryBooks' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        handler: "getAllOrQueryBooks",
        message: "Error fetching books",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        errorMessage: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

const deleteAllBooks = async (req, res) => {
  try {
    throw new Error("This is a test error");
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
    console.log(
      `Error in 'deleteAllBooks' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        handler: "deleteAllBooks",
        message: "Error deleting books",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        errorMessage: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(), // Include the timestamp
      },
    });
  }
};

const getAllTitles = async (req, res) => {
  try {
    const books = await Book.findAll({
      attributes: ["title"],
      group: "title",
    });
    const titles = books.map((book) => book.title);

    if (!titles.length) {
      res.status(404).json({
        message: "No books found with that title",
      });
      return;
    }
    res.status(200).json(titles);
  } catch (error) {
    console.log(
      `Error in 'getAllTitles' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        handler: "getAllTitles",
        message: "Error getting titles",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        errorMessage: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

const dynamicallyUpdateByTitle = async (req, res) => {
  try {
    // Fetch the current state of the book
    const currentBook = await Book.findOne({
      where: { title: req.params.title },
    });

    if (!currentBook) {
      res.status(404).json({
        message: "Book not found",
      });
      return;
    }

    // Perform the update
    await Book.update(
      {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
      },
      {
        where: { title: req.params.title },
      }
    ); // The .update() method returns an array with two elements. The first element is the number of rows that were updated. The second element is an array of the actual rows that were updated. We use array destructuring to capture these two elements in two separate variables.

    // Fetch the updated state of the book
    const updatedBook = await Book.findOne({
      where: { title: req.body.title },
    });

    res.status(200).json({
      message: "Book updated successfully",
      beforeUpdate: currentBook,
      afterUpdate: updatedBook,
    });
  } catch (error) {
    console.log(
      `Error in 'dynamicallyUpdateByTitle' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        handler: "dynamicallyUpdateByTitle",
        message: "Error updating book",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        errorMessage: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

const getAllAuthors = async (req, res) => {
  try {
    const books = await Book.findAll({
      attributes: ["author"],
      group: "author",
    });
    const authors = books.map((book) => book.author);

    if (!authors.length) {
      res.status(404).json({
        message: "No authors found",
      });
      return;
    }
    res.status(200).json(authors);
  } catch (error) {
    console.log(
      `Error in 'getAllAuthors' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        handler: "getAllAuthors",
        message: "Error getting authors",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        errorMessage: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

const getAllGenres = async (req, res) => {
  try {
    const books = await Book.findAll({
      attributes: ["genre"],
      group: "genre",
    });
    const genres = books.map((book) => book.genre);

    if (!genres.length) {
      res.status(404).json({
        message: "No genres found",
      });
      return;
    }
    res.status(200).json(genres);
  } catch (error) {
    console.log(
      `Error in 'getAllGenres' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        handler: "getAllGenres",
        message: "Error getting genres",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        errorMessage: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

// Export the controller functions as an object so they can be imported and used in routes.js.
module.exports = {
  addBooks,
  getAllOrQueryBooks,
  deleteAllBooks,
  getAllTitles,
  //   getBookByTitle,
  dynamicallyUpdateByTitle,
  //   deleteBookByTitle,
  getAllAuthors,
  //   getAllBooksFromAuthor,
  //   updateAuthorNameForAllBooks,
  //   deleteAllBooksByAuthor,
  getAllGenres,
  //   getAllBooksFromGenre,
  //   updateGenreForAllBooks,
  //   deleteAllBooksByGenre,
  //   getBookById,
  //   updateBookById,
  //   deleteBookById,
};
