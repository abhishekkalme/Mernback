const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authMiddleware } = require("../middleware/authMiddleware");
const Note = require("../models/Note");

const router = express.Router();

// ⛳ Step 1: Set basic Multer config — don't rename yet
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../temp")); // temporary upload folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique temp name
  },
});

const upload = multer({ storage });

// ✅ Upload Route
router.post("/", authMiddleware, upload.single("pdf"), async (req, res) => {
  try {
    const { year, subject, unit } = req.body;

    if (!req.file || !year || !subject || !unit) {
      return res.status(400).json({ message: "Missing required fields or file" });
    }

    // Clean values
    const cleanUnit = unit.replace(/\s+/g, "-").toLowerCase();
    const filename = `${subject}-${cleanUnit}${path.extname(req.file.originalname)}`;
    const targetDir = path.join(__dirname, `../pdfs/${year}/${subject}`);
    fs.mkdirSync(targetDir, { recursive: true });

    const targetPath = path.join(targetDir, filename);

    // If file exists, append timestamp
    let finalPath = targetPath;
    if (fs.existsSync(finalPath)) {
      const timestamp = Date.now();
      const newFilename = `${subject}-${cleanUnit}-${timestamp}${path.extname(req.file.originalname)}`;
      finalPath = path.join(targetDir, newFilename);
    }

    // Move file from temp to final destination
    fs.renameSync(req.file.path, finalPath);

    // Save to DB
    const note = new Note({
      uploader: req.user.userId,
      year,
      subject,
      unit,
      filePath: finalPath.replace(path.join(__dirname, "../"), ""), // relative path
      approved: true,
    });

    await note.save();

    res.status(201).json({ message: "Note uploaded successfully", note });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
