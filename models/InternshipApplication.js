// models/InternshipApplication.js
const mongoose = require('mongoose');

const internshipApplicationSchema = new mongoose.Schema({
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
        required: true
    },
    CGPA: {
        type: Number,
        required: true
    },
    applicationDate: {
        type: Date,
        default: Date.now
    },
    resumePath: {
        type: String
    }
});

const InternshipApplication = mongoose.model('InternshipApplication', internshipApplicationSchema);
module.exports = InternshipApplication;