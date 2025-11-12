// models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    studentEmail: {
        type: String,
        required: true
    },
    company: { type: String, required: true },
    jobTitle: { type: String, required: true },
    
    // 👇 --- THIS IS THE FIX --- 👇
    CGPA: { 
        type: Number, // Use 'Number', not 'Float'
        required: true 
    },
    // 👆 --- END OF FIX --- 👆

    applicationDate: {
        type: Date,
        default: Date.now
    },
    resumePath: String, 
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;