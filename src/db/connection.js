// External Dependencies - From third-party packages.
const { Sequelize } = require("sequelize"); // Sequelize class from the "sequelize" package.

// Sequelize instance for connecting to the MySQL database.
const sequelize = new Sequelize(process.env.MYSQL_URI);

// Call the 'authenticate' method on the 'sequelize' object.
sequelize.authenticate();
// sequelize: This is an instance of Sequelize, which is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite, and Microsoft SQL Server. It's used to establish connections to the database, define models, execute queries, and handle results.
// .authenticate(): This is a method provided by Sequelize that tests the connection to the database. It does this by running a simple query (SELECT 1+1 AS result for example) to ensure that the database server is responsive.

// When you call sequelize.authenticate():
// Sequelize will attempt to connect to the database using the configuration you provided when you instantiated sequelize. If the connection is successful, the promise will resolve and your application can continue running. If the connection fails, the promise will reject, and you can handle the error as needed.
// This method is used at the start of an application to ensure that the database connection is correctly set up before the application starts serving requests.

// Export the 'sequelize' function so that it can be imported and used in server.js.
module.exports = sequelize;
