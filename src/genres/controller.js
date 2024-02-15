// Internal Module Imports - From files within the project.
const Genre = require("./model"); // Import the Genre model from the model.js file.

// Controller Functions - Define the route handlers.

// POST /genres
const addGenres = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const newGenres = await Genre.bulkCreate(
        req.body.map((genre) => ({
          genreName: genre.genreName,
        }))
      );
      const genreNames = newGenres.map((genre) => genre.genreName).join(", ");

      res.status(201).json({
        success: {
          handler: "addGenres",
          message: `Genres added: ${genreNames}`,
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
          data: newGenres,
        },
      });
      return;
    }

    const newGenre = await Genre.create({
      genreName: req.body.genreName,
    });
    res.status(201).json({
      success: {
        handler: "addGenres",
        message: `Genre added: ${req.body.genreName}`,
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: newGenre,
      },
    });
  } catch (error) {
    console.log(
      `Error in 'addGenres' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        handler: "addGenres",
        name: error.name,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    });
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
    console.log(
      `Error in 'getAllOrQueryGenres' on request ${req.method} ${req.originalUrl}: `,
      error
    );
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
  addGenres,
  getAllOrQueryGenres,
};
