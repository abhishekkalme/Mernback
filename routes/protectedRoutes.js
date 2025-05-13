const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const User = require("../models/User");

// Make sure verifyToken is a function
console.log("verifyToken is:", typeof verifyToken); // This should log 'function'
// Example protected route
// router.get("/protected", verifyToken, (req, res) => {
//   res.json({ message: "You accessed a protected route", user: req.user });
// });

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const { verifyToken, } = require("../middleware/authMiddleware");

// // Basic protected route for testing
// router.get("/", verifyToken, (req, res) => {
//   res.json({ message: "Welcome to the dashboard", user: req.user });
// });

// module.exports = router;
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // skip password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error in /me route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;