const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const XLSX = require('xlsx');

dotenv.config();

// Connect to the database
const uri = process.env.DB_URI;
mongoose.connect(uri);

// Initialize express app
const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));

// Home route
app.get("/", (req, res) => {
    res.send('Welcome to the server!');
});

// Route to generate and download an Excel file
app.get("/generate-excel", (req, res) => {
    // Data to write
    const data = [
        ["Name", "Age"],
        ["John Doe", 30],
        ["Jane Smith", 25]
    ];

    // Convert data to a worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Specify file name
    const fileName = 'example.xlsx';

    // Create a buffer from the workbook
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    // Set headers to prompt download
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Send the buffer
    res.send(buf);
});


// Routes for other resources
app.use("/v1/author", require("./routes/author"));
app.use("/v1/book", require("./routes/book"));
app.use("/v1/auth", require("./routes/auth"));
app.use("/v1/genre", require("./routes/genre"));
app.use("/v1/work", require("./routes/work"));

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
