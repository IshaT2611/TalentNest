// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true },
    phoneNumber: String,
    uid: String, // Kept as optional
    rollNumber: String, // ✅ Changed to String to accept values like "46/B"
    department: String,
    yearOfStudy: String,
    division: String,
    gender: String,
    password: { type: String, required: true },
    skills: [String],
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;