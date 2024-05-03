const { Author, Book } = require("../models/model");

const authorController = {
     addAuthor: async (req, res) => {
          try {
               const newAuthor = await Author(req.body);

               const saveAuthor = await newAuthor.save();

               res.status(200).json(saveAuthor);
          } catch (error) {
               res.status(500).json(error);
          }
     },
     getAllAuthors: async (req, res) => {
          try {
               const author = await Author.find();
               res.status(200).json(author);
          } catch (error) {
               res.status(500).json(error);
          }
     },
     getDetailsAuthor: async (req, res) => {
          try {
               const author = await Author.findOne({
                    name: req.params.author,
               }).populate({
                    path: "books",
               });
               if (!author) {
                    return res
                         .status(404)
                         .json({ message: "Author not found" });
               }
               res.status(200).json(author);
          } catch (error) {
               res.status(500).json(error);
          }
     },
     updateAuthor: async (req, res) => {
          try {
               const author = await Author.findOne({ name: req.params.author });
               if (!author) {
                    return res
                         .status(404)
                         .json({ message: "author not found" });
               }
               await author.updateOne({ $set: req.body });

               res.status(200).json({ message: "Author updated successfully" });
          } catch (error) {
               res.status(500).json(error);
          }
     },
     deleteAuthor: async (req, res) => {
          try {
               // cach 1 : xoa author dua author trong book ve null

               await Book.updateMany(
                    { author: req.params.id },
                    { author: null }
               );
               await Author.findByIdAndDelete(req.params.id);

               // cach 2: xoa author va dong thoi xoa luon book

               res.json({ message: "Author deleted successfully" });
          } catch (error) {
               res.status(500).json(error);
          }
     },
};

module.exports = authorController;
