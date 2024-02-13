// External Dependencies - From third-party packages.
const { Router } = require("express");

// Router Instance - Create a new instance of an Express router.
const bookRouter = Router();

// Internal Module Imports - From files within the project.
const Book = require("./model"); // From the model.js file
const {} = require("./controller"); // Controller Functions from controller.js

// Controller Functions - Define the route handlers.

// Export the bookRouter object so it can be imported and used in server.js.
module.exports = bookRouter;
