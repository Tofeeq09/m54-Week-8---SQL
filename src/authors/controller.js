// Internal Module Imports - From files within the project.
const Author = require("./model"); // Import the Author model from the model.js file.

// Controller Functions - Define the route handlers.

// Add Authors - POST /authors
const addAuthors = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const newAuthors = await Author.bulkCreate(
        req.body.map((author) => ({
          authorName: author.authorName,
        }))
      );
      const authorNames = newAuthors
        .map((author) => author.authorName)
        .join(", ");

      res.status(201).json({
        success: {
          handler: "addAuthors",
          message: `Authors added: ${authorNames}`,
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
          data: newAuthors,
        },
      });
      return;
    }

    const newAuthor = await Author.create({
      authorName: req.body.authorName,
    });
    res.status(201).json({
      success: {
        handler: "addAuthors",
        message: `Author added: ${req.body.authorName}`,
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: newAuthor,
      },
    });
  } catch (error) {
    console.log(
      `Error in 'addAuthors' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        handler: "addAuthors",
        message: "Error adding authors",
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        errorMessage: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

// Get All or Query Authors - GET /authors
const getAllOrQueryAuthors = async (req, res) => {
  try {
    const authors = await Author.findAll({ where: req.query });

    if (!authors.length) {
      res.status(404).json({
        error: {
          handler: "getAllOrQueryAuthors",
          message: "No authors found",
          method: req.method,
          url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    let message = "All authors";
    if (Object.keys(req.query).length) {
      message = "Filtered authors";
    }

    res.status(200).json({
      success: {
        handler: "getAllOrQueryAuthors",
        message: message,
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        data: {
          query: req.query,
          authors: authors,
        },
      },
    });
  } catch (error) {
    console.log(
      `Error in 'getAllOrQueryAuthors' on request ${req.method} ${req.originalUrl}: `,
      error
    );
    res.status(500).json({
      error: {
        handler: "getAllOrQueryAuthors",
        message: "Error fetching authors",
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
  addAuthors,
  getAllOrQueryAuthors,
};
