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
const uri = process.env.MONGODB_URL;

// Create a new MongoClient
const client = new MongoClient(uri, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
});

// Connect to the MongoDB server
async function connectToMongoDB() {
     try {
          await client.connect();
          console.log("Connected to MongoDB");
     } catch (err) {
          console.error("Error connecting to MongoDB:", err);
     }
}

connectToMongoDB();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));
app.get("/", async (req, res) => {
     if (!req.body.name) {
          return res.status(400).json({ message: "Missing required fields" });
     }
     try {
          const newWork = new Work(req.body);
          const savedWork = await newWork.save();
          res.status(201).json(savedWork);
     } catch (error) {
          console.error("Failed to add work:", error);
          res.status(500).json({
               message: "Error adding work",
               details: error.message,
          });
     }
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
