// routes/adminRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const router = express.Router();

// Admin Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, email, password: hashedPassword });
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering admin" });
  }
});

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Admin login successful!", admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in admin" });
  }
});

module.exports = router;
