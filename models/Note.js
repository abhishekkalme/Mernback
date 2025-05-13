const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    // uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // uploader: { type: String, required: true },
    year: { type: String, required: true },
    subject: { type: String, required: true },
    unit: { type: String, required: true },
    filePath: { type: String, required: true },
    approved: { type: Boolean, default: false }, // Admin approval status
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);
