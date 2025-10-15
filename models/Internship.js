// models/Internship.js
const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    studentEmail: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    yearOfStudy: {
        type: String,
        required: true
    },
    internshipType: {
        type: String,
        required: true,
        enum: ['In-house', 'Out-house'] // Ensures only these two values are allowed
    },
    applicationDate: {
        type: Date,
        default: Date.now
    },
    resumePath: {
        type: String,
        required: true
    },
});

const Internship = mongoose.model('Internship', internshipSchema);

module.exports = Internship;