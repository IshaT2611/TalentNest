const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Admin Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newAdmin = new Admin({ username, email, password });
    await newAdmin.save();
    res.send('Admin registered successfully');
  } catch (err) {
    res.status(500).send('Error registering admin');
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  const { username, email, password } = req.body;
  const admin = await Admin.findOne({ username, email, password });
  if (admin) {
    res.redirect('/admin/home.html');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

module.exports = router;
