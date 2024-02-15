// External Dependencies - From third-party packages.
const { Router } = require("express");

// Router Instance - Create a new instance of an Express router.
const bookRouter = Router(); // Returns a new router object.

// Internal Module Imports - From files within the project.
const {
  addBooks,
  getAllOrQueryBooks,
  deleteAllBooks,
  getAllTitles,
  getBookByTitle,
  dynamicallyUpdateByTitle,
  deleteBookByTitle,
} = require("./controller"); //Controller Functions from controller.js

// Controller Functions - Define the route handlers.
bookRouter.post("/", addBooks);
bookRouter.get("/", getAllOrQueryBooks);
bookRouter.delete("/", deleteAllBooks);
bookRouter.get("/title", getAllTitles);
bookRouter.get("/title/:title", getBookByTitle);
bookRouter.put("//:title", dynamicallyUpdateByTitle);
bookRouter.delete("/title/:title", deleteBookByTitle);

// Export the bookRouter object so it can be imported and used in server.js.
module.exports = bookRouter;
