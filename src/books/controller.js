// Internal Module Imports - From files within the project.
const Book = require("./model"); // Import the Book model from the model.js file.
const Author = require("../authors/model"); // Import the Author model from the model.js file.
const Genre = require("../genres/model"); // Import the Genre model from the model.js file.

// Controller Functions - Define the route handlers.

const addBooks = async (req, res) => {
  try {
    const findAuthor = async (name) => {
      const author = await Author.findOne({ where: { name } });
      if (!author) throw new Error(`Author not found: ${name}`);
      author.id;
      return;
    };

    const findGenre = async (name) => {
      const genre = await Genre.findOne({ where: { name } });
      if (!genre) throw new Error(`Genre not found: ${name}`);
      genre.id;
      return;
    };

    if (Array.isArray(req.body)) {
      const newBooks = await Book.bulkCreate(
        await Promise.all(
          req.body.map(async (book) => ({
            title: book.title,
            AuthorId: await findAuthor(book.author),
            GenreId: await findGenre(book.genre),
          }))
        )
      );
      const bookTitles = newBooks.map((book) => book.title).join(", ");

      const booksWithDetails = await Book.findAll({
        where: { id: newBooks.map((book) => book.id) },
        include: [
          {
            model: Author,
            as: "Author",
          },
          {
            model: Genre,
            as: "Genre",
          },
        ],
      });

      res.status(201).json({
        success: {
          handler: "addBooks",
          message: `Books added: ${bookTitles}`,
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
          data: booksWithDetails,
        },
      });
      return;
    }

    const newBook = await Book.create({
      title: req.body.title,
      AuthorId: await findAuthor(req.body.author),
      GenreId: await findGenre(req.body.genre),
    });

    const bookWithDetails = await Book.findOne({
      where: { id: newBook.id },
      include: [
        {
          model: Author,
          as: "Author",
        },
        {
          model: Genre,
          as: "Genre",
        },
      ],
    });

    res.status(201).json({
      success: {
        handler: "addBooks",
        message: `Book added: ${req.body.title}`,
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: bookWithDetails,
      },
    });
  } catch (error) {
    console.log(
      `Error in 'addBooks' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        handler: "addBooks",
        name: error.name,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

const getAllOrQueryBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      where: req.query,
      attributes: { exclude: ["GenreId", "AuthorId"] },
      include: [
        {
          model: Author,
          as: "Author",
        },
        {
          model: Genre,
          as: "Genre",
        },
      ],
    });

    if (!books.length) {
      res.status(404).json({
        error: {
          handler: "getAllOrQueryBooks",
          message: "No books found",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    let message = "All books";
    if (Object.keys(req.query).length) {
      message = "Filtered books";
    }

    res.status(200).json({
      success: {
        handler: "getAllOrQueryBooks",
        message: message,
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: {
          query: req.query,
          books: books,
        },
      },
    });
  } catch (error) {
    console.log(
      `Error in 'getAllOrQueryBooks' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        handler: "getAllOrQueryBooks",
        name: error.name,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

const deleteAllBooks = async (req, res) => {
  try {
    const booksToDelete = await Book.findAll({ where: {} });
    if (booksToDelete.length === 0) {
      res.status(204).json({
        error: {
          handler: "deleteAllBooks",
          message: "No books found to delete. The database is already empty.",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    const result = await Book.destroy({ where: {} });
    res.status(200).json({
      success: {
        handler: "deleteAllBooks",
        message: `${result} books deleted. The database is now empty.`,
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: { deletedCount: result, deletedBooks: booksToDelete },
      },
    });
  } catch (error) {
    console.log(
      `Error in 'deleteAllBooks' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        handler: "deleteAllBooks",
        name: error.name,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
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
        error: {
          handler: "getAllTitles",
          message: "No titles found",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }
    res.status(200).json({
      success: {
        handler: "getAllTitles",
        message: "Titles fetched successfully",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: titles,
      },
    });
  } catch (error) {
    console.log(
      `Error in 'getAllTitles' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        handler: "getAllTitles",
        name: error.name,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

const getBookByTitle = async (req, res) => {
  try {
    const book = await Book.findOne({ where: { title: req.params.title } });
    if (!book) {
      res.status(404).json({
        error: {
          handler: "getBookByTitle",
          message: "Book not found",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }
    res.status(200).json({
      success: {
        handler: "getBookByTitle",
        message: "Book retrieved successfully",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: book,
      },
    });
  } catch (error) {
    console.log(
      `Error in 'getBookByTitle' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        handler: "getBookByTitle",
        name: error.name,
        message: error.message,
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
        error: {
          handler: "dynamicallyUpdateByTitle",
          message: "Book not found",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    // Perform the update
    await Book.update(
      {
        title: req.body.title,
        AuthorId: req.body.AuthorId,
        GenreId: req.body.GenreId,
      },
      {
        where: { title: req.params.title },
      }
    );

    // Fetch the updated state of the book
    const updatedBook = await Book.findOne({
      where: { title: req.body.title },
    });

    const fieldsToCheck = ["title", "author", "genre"];
    if (
      fieldsToCheck.every((field) => currentBook[field] === updatedBook[field])
    ) {
      res.status(304).json({
        error: {
          handler: "dynamicallyUpdateByTitle",
          message: "No changes detected. Book not updated.",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
          data: {
            beforeUpdate: currentBook,
            afterUpdate: updatedBook,
          },
        },
      });
      return;
    }

    res.status(200).json({
      success: {
        handler: "dynamicallyUpdateByTitle",
        message: "Book updated successfully",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: {
          beforeUpdate: currentBook,
          afterUpdate: updatedBook,
        },
      },
    });
  } catch (error) {
    console.log(
      `Error in 'dynamicallyUpdateByTitle' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        handler: "dynamicallyUpdateByTitle",
        name: error.name,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

const deleteBookByTitle = async (req, res) => {
  try {
    const booksToDelete = await Book.findAll({
      where: {
        title: req.params.title,
      },
    });

    if (!booksToDelete.length) {
      res.status(404).json({
        error: {
          handler: "deleteBookByTitle",
          message: "Book not found",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    await Book.destroy({
      where: {
        title: req.params.title,
      },
    });

    res.status(200).json({
      success: {
        handler: "deleteBookByTitle",
        message: "Book successfully deleted",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: booksToDelete,
      },
    });
  } catch (error) {
    console.log("Error deleting book: ", error);
    res.status(500).json({
      error: {
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        handler: "deleteBookByTitle",
        name: error.name,
        message: error.message,
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
  getBookByTitle,
  dynamicallyUpdateByTitle,
  deleteBookByTitle,
};
