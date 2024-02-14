// External Dependencies - From third-party packages.
const { Router } = require("express");

// Router Instance - Create a new instance of an Express router.
const genreRouter = Router(); // Returns a new router object.

// Internal Module Imports - From files within the project.
const { addGenres, getAllOrQueryGenres } = require("./controller"); //Controller Functions from controller.js

// Controller Functions - Define the route handlers.
genreRouter.post("/", addGenres);
genreRouter.get("/", getAllOrQueryGenres);

// Export the bookRouter object so it can be imported and used in server.js.
module.exports = genreRouter;
