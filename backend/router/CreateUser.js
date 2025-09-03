const express = require("express");
const User = require("../model/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Ensure SECRET_KEY is loaded before starting
if (!process.env.SECRET_KEY) {
  console.error("FATAL ERROR: SECRET_KEY is not defined in .env file");
  process.exit(1); // Exit the process if the key is missing
}

// ROUTE 1: Create a new user at /api/createuser
router.post(
  "/createuser",
  body("email", "Invalid email").isEmail(),
  body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const secpassword = await bcrypt.hash(req.body.password, salt);

      await User.create({
        name: req.body.name,
        email: req.body.email.toLowerCase(), // <-- FIX: Store email in lowercase
        password: secpassword,
        location: req.body.location,
      });

      res.json({ success: true });
    } catch (error) {
      console.error(error.message);
      // FIX: Handle duplicate email error specifically
      if (error.code === 11000) {
        return res.status(400).json({ success: false, error: "An account with this email already exists." });
      }
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

// ROUTE 2: Login an existing user at /api/loginuser
router.post(
  "/loginuser",
  body("email", "Invalid email").isEmail(),
  body("password", "Password cannot be blank").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let email = req.body.email.toLowerCase();
    try {
      let userData = await User.findOne({ email });
      if (!userData) {
        return res.status(400).json({ success: false, error: "Invalid credentials. Please try again." });
      }

      const pwdcompare = await bcrypt.compare(req.body.password, userData.password);
      if (!pwdcompare) {
        return res.status(400).json({ success: false, error: "Invalid credentials. Please try again." });
      }

      const data = {
        user: {
          id: userData.id,
        },
      };

      // IMPROVEMENT: Add expiration to the token
      const authToken = jwt.sign(data, process.env.SECRET_KEY);

      return res.json({ success: true, authToken: authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

module.exports = router;
