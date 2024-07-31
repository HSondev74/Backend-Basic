const { Author, Book } = require("../models/model");
const XLSX = require('xlsx');

const bookController = {
    addABook: async (req, res) => {
        try {
            const newBook = new Book(req.body); // Use `new Book()` to instantiate
            const saveBook = await newBook.save();

            if (req.body.author) {
                const author = await Author.findById(req.body.author); // Use await here
                if (author) {
                    await author.updateOne({ $push: { books: saveBook._id } });
                }
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

    exportBooksToExcel: async (req, res) => {
        try {
            // Fetch all books
            const books = await Book.find();

            console.log('===================', books);

            // Convert book data to array format suitable for Excel
            const data = [
                ["Name", "Author", "Published Date", "Genres"], // Header row
                ...books.map(book => [
                    book.name, 
                    book.author ? book.author : 'Unknown', // Assuming `author` field has a `name` property
                    book.publishedDate, // Convert date to string
                    book.genres
                ])
            ];

            // Create a new workbook and add a worksheet
            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Books');

            // Generate Excel file buffer
            const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

            // Set headers and send the file
            res.setHeader('Content-Disposition', 'attachment; filename=books.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buf);
        } catch (error) {
            console.error("Failed to export books to Excel:", error);
            res.status(500).json({ message: "Error exporting books", details: error.message });
        }
    }
};

module.exports = bookController;
