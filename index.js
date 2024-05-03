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

dotenv.config();

//CONNECT DATABASE

mongoose.connect(process.env.MONGODB_URL).then(() => console.log("Connected!"));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));

app.use("/v1/author", authorRouter);
app.use("/v1/book", bookRouter);
app.use("/v1/auth", authRouter);
app.use("/v1/genre", genreRouter);
app.use("/v1/work", workRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
     console.log(`Server is running on port ${port}`);
});
