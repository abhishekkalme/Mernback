const mongoose = require("mongoose");

const syllabusSchema = new mongoose.Schema({
  name: String,
  code: String,
  program: String,
  grading: String,
  system: String,
  pdfs: Object, // { 1: "url", 2: "url" }
});

module.exports = mongoose.model("Syllabus", syllabusSchema);
