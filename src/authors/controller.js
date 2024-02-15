// Internal Module Imports - From files within the project.
const Author = require("./model"); // Import the Author model from the model.js file.

// Controller Functions - Define the route handlers.

// Add Authors - POST /authors
const addAuthor = async (req, res) => {
  try {
    const { author } = req.body;

    if (!author) {
      return res.status(400).json({ success: false, message: "Author is required" });
    }

    const authorExists = await Author.findOne({ where: { author: author } });

    if (authorExists) {
      return res.status(400).json({ success: false, message: `Author ${author} already exists` });
    }

    const newAuthor = await Author.create({ author });

    return res.status(201).json({
      success: true,
      message: `${newAuthor.author} was added`,
      data: { id: newAuthor.id, author: newAuthor.author },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error adding author", error: error.errors });
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
    console.log(`Error in 'getAllOrQueryAuthors' on request ${req.method} ${req.originalUrl}: `, error);
    res.status(500).json({
      error: {
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        handler: "getAllOrQueryAuthors",
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
  addAuthor,
  getAllOrQueryAuthors,
};
