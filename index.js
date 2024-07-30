const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authorRouter = require("./routes/author");
const bookRouter = require("./routes/book");
const authRouter = require("./routes/auth");
const genreRouter = require("./routes/genre");
const workRouter = require("./routes/work");
const { MongoClient } = require("mongodb");
const { Work } = require("./models/model");

dotenv.config();

//CONNECT DATABASE

// Connection URI
const uri = process.env.DB_URI;

// Create a new MongoClient
mongoose.connect(uri);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));
app.get("/", async (req, res) => {
     res.send('Welcome to server!');    
     // try {
     //      const allWork = await Work.find();
     //      res.status(200).json(allWork);
     // } catch (error) {
     //      console.error("Failed to get all Work:", error);
     //      res.status(500).json({
     //           message: "Error retrieving Work",
     //           details: error.message,
     //      });
     // }
});
app.use("/v1/author", authorRouter);
app.use("/v1/book", bookRouter);
app.use("/v1/auth", authRouter);
app.use("/v1/genre", genreRouter);
app.use("/v1/work", workRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
     console.log(`Server is running on port ${port}`);
});
