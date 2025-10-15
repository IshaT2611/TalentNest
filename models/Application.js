// models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    studentEmail: { // Use email to link, or studentId after a login flow
        type: String,
        required: true
    },
    company: { type: String, required: true },
    jobTitle: { type: String, required: true },
    applicationDate: {
        type: Date,
        default: Date.now
    },
    // If you implement resume upload:
     resumePath: String, // Store path to the uploaded file
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;