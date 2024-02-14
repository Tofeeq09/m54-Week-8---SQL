// Internal Module Imports - From files within the project.
const Book = require("./model"); // Import the Book model from the model.js file.

// Controller Functions - Define the route handlers.

const addBooks = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const newBooks = await Book.bulkCreate(
        req.body.map((book) => ({
          title: book.title,
          AuthorId: book.AuthorId,
          GenreId: book.GenreId,
        }))
      );
      const bookTitles = newBooks.map((book) => book.title).join(", ");

      res.status(201).json({
        success: {
          handler: "addBooks",
          message: `Books added: ${bookTitles}`,
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
          data: newBooks,
        },
      });
      return;
    }

    const newBook = await Book.create({
      title: req.body.title,
      AuthorId: req.body.AuthorId,
      GenreId: req.body.GenreId,
    });
    res.status(201).json({
      success: {
        handler: "addBooks",
        message: `Book added: ${req.body.title}`,
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: newBook,
      },
    });
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
    const books = await Book.findAll({
      where: req.query,
      attributes: { exclude: ["GenreId", "AuthorId"] },
      include: ["Author", "Genre"],
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
      message: {
        handler: "deleteAllBooks",
        message: "Error deleting books",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        errorMessage: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
      error: error,
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
        handler: "getBookByTitle",
        message: "Error getting book",
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
        author: req.body.author,
        genre: req.body.genre,
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
        handler: "deleteBookByTitle",
        message: "Error deleting book",
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
        error: {
          handler: "getAllAuthors",
          message: "No authors found",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }
    res.status(200).json({
      success: {
        handler: "getAllAuthors",
        message: "Authors retrieved successfully",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: authors,
      },
    });
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

const getAllBooksFromAuthor = async (req, res) => {
  try {
    const books = await Book.findAll({ where: { author: req.params.author } });

    if (books.length === 0) {
      res.status(404).json({
        error: {
          handler: "getAllBooksFromAuthor",
          message: "No books found from this author",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    res.status(200).json({
      success: {
        handler: "getAllBooksFromAuthor",
        message: "Books retrieved successfully",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: books,
      },
    });
  } catch (error) {
    console.log("Error retrieving books: ", error);
    res.status(500).json({
      error: {
        handler: "getAllBooksFromAuthor",
        message: "Error retrieving books",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        errorMessage: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

const updateAuthorForAllBooksOfSpecificAuthor = async (req, res) => {
  try {
    // Fetch the current state of the book
    const currentBooks = await Book.findAll({
      where: { author: req.params.author },
    });

    if (!currentBooks.length) {
      res.status(404).json({
        error: {
          handler: "updateAuthorNameForAllBooks",
          message: "No books found from this author",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    // Perform the update
    await Book.update(
      { author: req.body.author },
      { where: { author: req.params.author } }
    );

    // Fetch the updated state of the book
    const updatedBooks = await Book.findAll({
      where: { author: req.body.author },
    });

    const fieldsToCheck = ["author"];
    if (
      fieldsToCheck.every(
        (field) => currentBooks[0][field] === updatedBooks[0][field]
      )
    ) {
      res.status(304).json({
        error: {
          handler: "updateAuthorNameForAllBooks",
          message: "No changes detected. Books not updated.",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
          data: {
            oldAuthor: req.params.genre,
            newAuthor: req.body.genre,
          },
        },
      });
      return;
    }

    res.status(200).json({
      success: {
        handler: "updateAuthorNameForAllBooks",
        message: `${updatedBooks.length} books updated`,
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: {
          oldAuthor: req.params.author,
          newAuthor: req.body.author,
          booksUpdated: updatedBooks.map((book) => book.title),
          booksUpdated: updatedBooks.map((book) => book.title),
        },
      },
    });
  } catch (error) {
    console.log(
      `Error in 'updateAuthorNameForAllBooks' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        handler: "updateAuthorNameForAllBooks",
        message: "Error updating books",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        errorMessage: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

const deleteAllBooksByAuthor = async (req, res) => {
  try {
    const booksToDelete = await Book.findAll({
      where: {
        author: req.params.author,
      },
    });

    if (!booksToDelete.length) {
      res.status(404).json({
        error: {
          handler: "deleteAllBooksByAuthor",
          message: "No books found from this author",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    await Book.destroy({
      where: {
        author: req.params.author,
      },
    });

    res.status(200).json({
      success: {
        handler: "deleteAllBooksByAuthor",
        message: `${booksToDelete.length} books deleted`,
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: booksToDelete,
      },
    });
  } catch (error) {
    console.log("Error deleting books: ", error);
    res.status(500).json({
      error: {
        handler: "deleteAllBooksByAuthor",
        message: "Error deleting books",
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
        error: {
          handler: "getAllGenres",
          message: "No genres found",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }
    res.status(200).json({
      success: {
        handler: "getAllGenres",
        message: "Genres retrieved successfully",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: genres,
      },
    });
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

const getAllBooksFromGenre = async (req, res) => {
  try {
    const books = await Book.findAll({ where: { genre: req.params.genre } });

    if (books.length === 0) {
      res.status(404).json({
        error: {
          handler: "getAllBooksFromGenre",
          message: "No books found for this genre",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    res.status(200).json({
      success: {
        handler: "getAllBooksFromGenre",
        message: "Books retrieved successfully",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: books,
      },
    });
  } catch (error) {
    console.log("Error retrieving books: ", error);
    res.status(500).json({
      error: {
        handler: "getAllBooksFromGenre",
        message: "Error retrieving books",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        errorMessage: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

const deleteAllBooksByGenre = async (req, res) => {
  try {
    const booksToDelete = await Book.findAll({
      where: {
        genre: req.params.genre,
      },
    });

    if (!booksToDelete.length) {
      res.status(404).json({
        error: {
          handler: "deleteAllBooksByGenre",
          message: "No books found for this genre",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    await Book.destroy({
      where: {
        genre: req.params.genre,
      },
    });

    res.status(200).json({
      success: {
        handler: "deleteAllBooksByGenre",
        message: `${booksToDelete.length} books deleted`,
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: booksToDelete,
      },
    });
  } catch (error) {
    console.log("Error deleting books: ", error);
    res.status(500).json({
      error: {
        handler: "deleteAllBooksByGenre",
        message: "Error deleting books",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        errorMessage: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

const updateGenreForAllBooksOfSpecificGenre = async (req, res) => {
  try {
    // Fetch the current state of the book
    const currentBooks = await Book.findAll({
      where: { genre: req.params.genre },
    });

    if (!currentBooks.length) {
      res.status(404).json({
        error: {
          handler: "updateGenreForAllBooks",
          message: "No books found from this genre",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    // Perform the update
    await Book.update(
      { genre: req.body.genre },
      { where: { genre: req.params.genre } }
    );

    // Fetch the updated state of the book
    const updatedBooks = await Book.findAll({
      where: { genre: req.body.genre },
    });

    const fieldsToCheck = ["genre"];
    if (
      fieldsToCheck.every(
        (field) => currentBooks[0][field] === updatedBooks[0][field]
      )
    ) {
      res.status(304).json({
        error: {
          handler: "updateGenreForAllBooks",
          message: "No changes detected. Books not updated.",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
          data: {
            oldGenre: req.params.genre,
            newGenre: req.body.genre,
          },
        },
      });
      return;
    }

    res.status(200).json({
      success: {
        handler: "updateGenreForAllBooks",
        message: `${updatedBooks.length} books updated`,
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: {
          oldGenre: req.params.genre,
          newGenre: req.body.genre,
          booksUpdated: updatedBooks.map((book) => book.title),
        },
      },
    });
  } catch (error) {
    console.log(
      `Error in 'updateGenreForAllBooks' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        handler: "updateGenreForAllBooks",
        message: "Error updating books",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        errorMessage: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({ where: { id: req.params.id } });
    if (!book) {
      res.status(404).json({
        error: {
          handler: "getBookById",
          message: "No book found with this id",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }
    res.status(200).json({
      success: {
        handler: "getBookById",
        message: "Book found",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: book,
      },
    });
  } catch (error) {
    console.log(
      `Error in 'getBookById' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        handler: "getBookById",
        message: "Error getting book",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        errorMessage: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

const dynamicallyUpdateById = async (req, res) => {
  try {
    // Fetch the current state of the book
    const currentBook = await Book.findOne({
      where: { id: req.params.id },
    });

    if (!currentBook) {
      res.status(404).json({
        error: {
          handler: "dynamicallyUpdateById",
          message: "Book not found",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    // Perform the update
    await Book.update(req.body, {
      where: { id: req.params.id },
    });

    // Fetch the updated state of the book
    const updatedBook = await Book.findOne({
      where: { id: req.params.id },
    });

    const fieldsToCheck = ["title", "author", "genre"];
    if (
      fieldsToCheck.every((field) => currentBook[field] === updatedBook[field])
    ) {
      res.status(304).json({
        error: {
          handler: "dynamicallyUpdateById",
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
        handler: "dynamicallyUpdateById",
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
      `Error in 'dynamicallyUpdateById' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        handler: "dynamicallyUpdateById",
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

const deleteBookById = async (req, res) => {
  try {
    const book = await Book.findOne({ where: { id: req.params.id } });
    if (!book) {
      res.status(404).json({
        error: {
          handler: "deleteBookById",
          message: "No book found with this id",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }
    await book.destroy();
    res.status(200).json({
      success: {
        handler: "deleteBookById",
        message: "Book deleted",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: book,
      },
    });
  } catch (error) {
    console.log(
      `Error in 'deleteBookById' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        handler: "deleteBookById",
        message: "Error deleting book",
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
  getBookByTitle,
  dynamicallyUpdateByTitle,
  deleteBookByTitle,
  getAllAuthors,
  getAllBooksFromAuthor,
  updateAuthorForAllBooksOfSpecificAuthor,
  deleteAllBooksByAuthor,
  getAllGenres,
  getAllBooksFromGenre,
  updateGenreForAllBooksOfSpecificGenre,
  deleteAllBooksByGenre,
  getBookById,
  dynamicallyUpdateById,
  deleteBookById,
};
