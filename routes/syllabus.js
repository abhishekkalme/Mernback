const express = require("express");
const router = express.Router();
const Syllabus = require("../models/Syllabus");
const { verifyAdmin } = require("../middleware/verifyToken");

// POST /api/syllabus - Add a new syllabus entry
router.post("/", verifyAdmin, async (req, res) => {
    try {
      const syllabus = new Syllabus(req.body); // 📥 Data sent from frontend
      await syllabus.save(); // 💾 Save to MongoDB
      res.status(201).json({ message: "Syllabus added" }); // ✅ Success response
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to insert syllabus" }); // ❌ Error response
    }
  });


// GET /api/syllabus (all or filtered)
router.get("/", async (req, res) => {
  const { program, system, grading } = req.query;

  const filter = {};
  if (program) filter.program = program;
  if (system) filter.system = system;
  if (grading) filter.grading = grading;

  try {
    const data = await Syllabus.find(filter);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// Update syllabus
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updated = await Syllabus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// Delete syllabus
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Syllabus.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});


module.exports = router;
