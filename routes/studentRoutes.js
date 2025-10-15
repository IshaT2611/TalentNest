// routes/studentRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");

const router = express.Router();



// Student Signup
router.post("/signup", async (req, res) => {
  try {
    // Destructure all fields from the form
    const {
      name,
      username,
      email,
      phone,
      uid,
      rollNumber,
      department,
      year,
      division,
      skills,
      gender,
      password,
    } = req.body;

    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // ✅ FINAL CORRECTION: Use the exact field names from your schema
    const newStudent = new Student({
      fullName: name,         // Match 'fullName' in schema
      username: username,
      email: email,
      phoneNumber: phone,     // Match 'phoneNumber' in schema
      uid: uid,
      rollNumber: rollNumber,
      department: department,
      yearOfStudy: year,      // Match 'yearOfStudy' in schema
      division: division,
      gender: gender,
      password: hashedPassword,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean), // Process skills into an array
    });

    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully!" });
  } catch (error)
  {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Error registering student" });
  }
});
// Student Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Student login successful!", student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in student" });
  }
});

module.exports = router;
