const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// ✅ Base directory where PDFs are stored
const pdfBaseDirectory = path.join(__dirname, "../pdfs");

// 📌 Dynamic Route for PDF Download
router.get("/download/:year/:subjectCode/:unit", (req, res) => {
  const { year, subjectCode, unit } = req.params;
  
  // ✅ Construct file path dynamically based on year, subject, and unit
  const filePath = path.join(pdfBaseDirectory, year, subjectCode, `${subjectCode}-unit-${unit}.pdf`);

  console.log("Requested file path:", filePath); // Debugging output

  // ✅ Check if file exists
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    console.error("File not found:", filePath);
    res.status(404).json({ message: "File not found" });
  }
});

module.exports = router;
