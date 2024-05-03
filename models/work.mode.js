const mongoose = require("mongoose");

const workSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true,
     },
     check: {
          type: Boolean,
     },
});
const works = mongoose.model("work", workSchema);
module.exports = { works };
