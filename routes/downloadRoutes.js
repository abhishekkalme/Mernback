const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/download/:year/:subject/:filename", (req, res) => {
  const { year, subject, filename } = req.params;
  const filePath = path.join(__dirname, `../pdfs/${year}/${subject}/${filename}`);

  res.download(filePath, (err) => {
    if (err) res.status(500).json({ message: "Error downloading file" });
  });
});

module.exports = router;
