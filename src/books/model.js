// External Dependencies - From third-party packages.
const { DataTypes } = require("sequelize"); // DataTypes class from the "sequelize" package.

// Internal Module Imports - From files within the project.
const sequelize = require("../db/connection"); // Import the sequelize connection from the connection.js file.

// Define the Book model with the sequelize.define() method.
const Book = sequelize.define(
  "Book",
  {
    title: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      defaultValue: "Unknown",
    },
    genre: {
      type: DataTypes.STRING,
      defaultValue: "Unknown",
    }, // Define the columns of the table.
  },
  { timestamps: false } // Additional options for the model: Disable timestamps.
);

// Export the Book mongoose model so that it can be imported and used in controller.js.
module.exports = Book;
