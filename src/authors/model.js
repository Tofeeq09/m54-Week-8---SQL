// External Dependencies - From third-party packages.
const { DataTypes } = require("sequelize"); // DataTypes class from the "sequelize" package.

// Internal Module Imports - From files within the project.
const sequelize = require("../db/connection"); // Import the sequelize connection from the connection.js file.

// Define the Author model with the sequelize.define() method.
const Author = sequelize.define(
  "Author",
  {
    authorName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  { timestamps: false } // Additional options for the model: Disable timestamps.
);

// Export the Author model so that it can be imported and used in controller.js.
module.exports = Author;
