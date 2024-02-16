// Internal Module Imports - From files within the project.
const Book = require("../books/model"); // Import the Book model from the model.js file.
const Author = require("../authors/model"); // Import the Author model from the model.js file.
const Genre = require("./model"); // Import the Genre model from the model.js file.

// Controller Functions - Define the route handlers.

// POST /genres
const addGenre = async (req, res) => {
  try {
    const { genre } = req.body;

    if (!genre) {
      return res.status(400).json({ success: false, message: "Genre is required" });
    }

    const genreExists = await Genre.findOne({ where: { genre: genre } });

    if (genreExists) {
      return res.status(400).json({ success: false, message: `Genre ${genre} already exists` });
    }

    const newGenre = await Genre.create({ genre });

    return res.status(201).json({
      success: true,
      message: `${newGenre.genre} was added`,
      data: { id: newGenre.id, genre: newGenre.genre },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error adding genre", error: error.errors });
  }
};

const getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.findAll({ where: req.query });

    if (!genres.length) {
      return res.status(404).json({
        success: false,
        message: "No genres found",
      });
    }

    // Fetch books for each genre
    const promises = genres.map(async (genre) => {
      const books = await Book.findAll({
        where: { GenreId: genre.id },
        include: [
          {
            model: Author,
            as: "Author",
            attributes: ["author"],
          },
        ],
      });

      return {
        id: genre.id,
        genre: genre.genre,
        books: books.map((book) => ({
          title: book.title,
          author: book.Author.author,
          genre: genre.genre,
        })),
      };
    });

    const formattedGenres = await Promise.all(promises);

    return res.status(200).json({
      success: true,
      message: "Genres fetched successfully",
      data: formattedGenres,
    });
  } catch (error) {
    console.error(error); // Log the error
    return res.status(500).json({
      success: false,
      message: "Error fetching genres",
      error: error.errors,
    });
  }
};

// Export the controller functions as an object so they can be imported and used in routes.js.
module.exports = {
  addGenre,
  getAllGenres,
};
