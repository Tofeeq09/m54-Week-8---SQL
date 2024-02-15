// Internal Module Imports - From files within the project.
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

// GET /genres
const getAllOrQueryGenres = async (req, res) => {
  try {
    const genres = await Genre.findAll({ where: req.query });

    if (!genres.length) {
      res.status(404).json({
        error: {
          handler: "getAllOrQueryGenres",
          message: "No genres found",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    let message = "All genres";
    if (Object.keys(req.query).length) {
      message = "Filtered genres";
    }

    res.status(200).json({
      success: {
        handler: "getAllOrQueryGenres",
        message: message,
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: {
          query: req.query,
          genres: genres,
        },
      },
    });
  } catch (error) {
    console.log(`Error in 'getAllOrQueryGenres' on request ${req.method} ${req.originalUrl}: `, error);
    res.status(500).json({
      error: {
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        handler: "getAllOrQueryGenres",
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
  addGenre,
  getAllOrQueryGenres,
};
