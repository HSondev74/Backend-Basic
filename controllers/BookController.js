const { Author, Book } = require("../models/model");

const bookController = {
     addABook: async (req, res) => {
          try {
               const newBook = await Book(req.body);

               const saveBook = await newBook.save();

               if (req.body.author) {
                    const author = Author.findById(req.body.author);
                    await author.updateOne({ $push: { books: saveBook._id } });
               }

               res.status(200).json(saveBook);
          } catch (error) {
               res.status(500).json(error);
          }
     },
     getAllBooks: async (req, res) => {
          try {
               const allBooks = await Book.find();
               res.status(200).json(allBooks);
          } catch (error) {
               res.status(500).json(error);
          }
     },
     getDetailsBook: async (req, res) => {
          try {
               const book = await Book.findById(req.params.id).populate({
                    path: "author",
                    // select: "-author", //hide author
               });
               if (!book) {
                    return res.status(404).json({ message: "Book not found" });
               }
               res.status(200).json(book);
          } catch (error) {
               res.status(500).json(error);
          }
     },
     updateABook: async (req, res) => {
          try {
               const book = await Book.findById(req.params.id);
               if (!book) {
                    return res.status(404).json({ message: "Book not found" });
               }
               await book.updateOne({ $set: req.body });

               res.status(200).json({ message: "Book updated successfully" });
          } catch (error) {
               res.status(500).json(error);
          }
     },
     deleteBook: async (req, res) => {
          try {
               await Author.updateMany(
                    { books: req.params.id },
                    { $pull: { books: req.params.id } }
               );
               await Book.findByIdAndDelete(req.params.id);

               res.json({ message: "Book deleted successfully" });
          } catch (error) {
               res.status(500).json(error);
          }
     },
};

module.exports = bookController;
