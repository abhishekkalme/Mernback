const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const syllabusRoutes = require("./routes/syllabus");
const path = require("path"); // Add this for serving static files

dotenv.config();
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// CORS configuration for frontend (adjust the origin based on your frontend setup)
app.use(
  cors({
    origin: "http://localhost:5173", // 👈 Must match your frontend
    credentials: true, // 👈 Allow cookies/authorization headers
  })
);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/download", require("./routes/downloadRoutes"));
app.use("/api/", require("./routes/pdfRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/syllabus", syllabusRoutes);



// Define the port
const PORT = process.env.PORT || 9000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
