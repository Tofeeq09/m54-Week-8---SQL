const { body } = require("express-validator");

const validateBook = [
  body("*.title").notEmpty().withMessage("Title must be specified."),
  body("*.author").notEmpty().withMessage("Author must be specified."),
  body("*.genres").isArray({ min: 1 }).withMessage("Genre must be specified."),
];
