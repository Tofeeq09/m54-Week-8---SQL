// External Dependencies - From third-party packages.
const { Router } = require("express");

// Router Instance - Create a new instance of an Express router.
const authorRouter = Router(); // Returns a new router object.

// Internal Module Imports - From files within the project.
const { addAuthors, getAllOrQueryAuthors } = require("./controller"); //Controller Functions from controller.js

// Controller Functions - Define the route handlers.
authorRouter.post("/", addAuthors);
authorRouter.get("/", getAllOrQueryAuthors);

// Export the authorRouter object so it can be imported and used in server.js.
module.exports = authorRouter;
