// Internal Module Imports - From files within the project.
const Book = require("../books/model"); // Import the Book model from the model.js file.
const Author = require("./model"); // Import the Author model from the model.js file.
const Genre = require("../genres/model"); // Import the Genre model from the model.js file.

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

const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.findAll({
      where: req.query,
      include: [
        {
          model: Book,
          as: "Books",
          attributes: ["title"],
          include: [
            {
              model: Genre,
              as: "Genre",
              attributes: ["genre"],
            },
          ],
        },
      ],
    });

    if (!authors.length) {
      return res.status(404).json({
        success: false,
        message: "No authors found",
      });
    }

    const formattedAuthors = authors.map((author) => ({
      id: author.id,
      author: author.author,
      books: author.Books.map((book) => ({
        title: book.title,
        genre: book.Genre.genre,
        author: author.author,
      })),
    }));

    return res.status(200).json({
      success: true,
      message: "Authors fetched successfully",
      data: formattedAuthors,
    });
  } catch (error) {
    console.error(error); // Log the error
    return res.status(500).json({
      success: false,
      message: "Error fetching authors",
      error: error.errors,
    });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { oldAuthorName } = req.params;
    const { author: newAuthorName } = req.body;

    if (!newAuthorName) {
      return res.status(400).json({ success: false, message: "Invalid Author" });
    }

    const authorExists = await Author.findOne({ where: { author: oldAuthorName } });

    if (!authorExists) {
      return res.status(404).json({ success: false, message: `Author ${oldAuthorName} not found` });
    }

    const newAuthorExists = await Author.findOne({ where: { author: newAuthorName } });

    if (newAuthorExists) {
      return res.status(400).json({ success: false, message: `Author ${newAuthorName} already exists` });
    }

    await Author.update({ author: newAuthorName }, { where: { author: oldAuthorName } });

    return res.status(200).json({
      success: true,
      message: "Author updated successfully",
      oldAuthorName: oldAuthorName,
      newAuthorName: newAuthorName,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error updating author", error: error.errors });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const { author } = req.params;
    const deletedAuthor = await Author.destroy({ where: { author: author } });

    if (!deletedAuthor) {
      return res.status(404).json({ success: false, message: "Author not found" });
    }

    return res.status(200).json({ success: true, message: "Author deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting author", error: error.errors });
  }
};

// Export the controller functions as an object so they can be imported and used in routes.js.
module.exports = {
  addAuthor,
  getAllAuthors,
  updateAuthor,
  deleteAuthor,
};
