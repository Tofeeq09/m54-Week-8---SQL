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

const deleteAllGenres = async (req, res) => {
  try {
    const deletedGenres = await Genre.destroy({ where: {} });

    if (!deletedGenres) {
      return res.status(404).json({ success: false, message: "No genres found" });
    }

    return res.status(200).json({ success: true, message: "All genres deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting genres", error: error.errors });
  }
};

const getGenre = async (req, res) => {
  try {
    const { genre } = req.params;

    const genreDetails = await Genre.findOne({
      where: { genre: genre },
      include: [
        {
          model: Book,
          as: "Books",
          attributes: ["title"],
          include: [
            {
              model: Author,
              as: "Author",
              attributes: ["author"],
            },
          ],
        },
      ],
    });

    if (!genreDetails) {
      return res.status(404).json({
        success: false,
        message: `Genre ${genre} not found`,
      });
    }

    const formattedGenre = {
      id: genreDetails.id,
      genre: genreDetails.genre,
      books: genreDetails.Books.map((book) => ({
        title: book.title,
        author: book.Author.author,
        genre: genreDetails.genre,
      })),
    };

    return res.status(200).json({
      success: true,
      message: "Genre fetched successfully",
      data: formattedGenre,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching genre", error: error.errors });
  }
};

const updateGenre = async (req, res) => {
  try {
    const { oldGenreName } = req.params;
    const { genre: newGenreName } = req.body; // Changed this line

    if (!newGenreName) {
      return res.status(400).json({ success: false, message: "Invalid Genre" });
    }

    const genreExists = await Genre.findOne({ where: { genre: oldGenreName } });

    if (!genreExists) {
      return res.status(404).json({ success: false, message: `Genre ${oldGenreName} not found` });
    }

    const newGenreExists = await Genre.findOne({ where: { genre: newGenreName } });

    if (newGenreExists) {
      return res.status(400).json({ success: false, message: `Genre ${newGenreName} already exists` });
    }

    await Genre.update({ genre: newGenreName }, { where: { genre: oldGenreName } });

    return res.status(200).json({
      success: true,
      message: "Genre updated successfully",
      oldGenreName: oldGenreName,
      newGenreName: newGenreName,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating genre", error: error.errors });
  }
};

const deleteGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const deletedGenre = await Genre.destroy({ where: { genre: genre } });

    if (!deletedGenre) {
      return res.status(404).json({ success: false, message: "Genre not found" });
    }

    return res.status(200).json({ success: true, message: "Genre deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting genre", error: error.errors });
  }
};

// Export the controller functions as an object so they can be imported and used in routes.js.
module.exports = {
  addGenre,
  getAllGenres,
  deleteAllGenres,
  getGenre,
  updateGenre,
  deleteGenre,
};
