const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Student Registration
router.post('/register', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).send('Registration Successful!');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Student Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email, password });
    if (student) {
      res.status(200).send('Login Successful!');
    } else {
      res.status(401).send('Invalid Email or Password');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
