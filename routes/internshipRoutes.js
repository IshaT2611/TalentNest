// routes/internshipRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Internship = require('../models/Internship'); // Our new Internship model
const Student = require('../models/Student'); // The existing Student model

// --- Multer Storage Configuration (can be the same as for jobs) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/resumes/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'internship-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route to handle NEW internship applications
router.post('/apply', upload.single('resume'), async (req, res) => {
    try {
        const { email, name, rollDivision, phone, branch, year, internshipType } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required." });
        }

        // --- Find or Create Student Logic ---
        let student = await Student.findOne({ email: email });

        if (!student) {
            student = new Student({
                fullName: name,
                email: email,
                username: email.split('@')[0],
                phoneNumber: phone,
                rollNumber: rollDivision,
                password: "defaultPassword",
                department: branch,
                yearOfStudy: year,
            });
            await student.save();
        }

        // --- Create the Internship Application ---
        const newInternship = new Internship({
            studentEmail: student.email,
            branch: branch,
            yearOfStudy: year,
            internshipType: internshipType,
            resumePath: req.file.path
        });

        await newInternship.save();
        res.status(201).json({ message: "Internship application submitted successfully!" });

    } catch (error) {
        console.error("Error submitting internship application:", error);
        res.status(500).json({ message: "Server error during internship application." });
    }
});

// Route for the ADMIN to GET all internship applications
router.get('/', async (req, res) => {
    try {
        const internships = await Internship.aggregate([
            { $sort: { applicationDate: -1 } },
            {
                $lookup: {
                    from: 'students',
                    localField: 'studentEmail',
                    foreignField: 'email',
                    as: 'studentDetails'
                }
            },
            { $unwind: { path: '$studentDetails', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    branch: 1,
                    yearOfStudy: 1,
                    internshipType: 1, // We need this field for the admin panel
                    applicationDate: 1,
                    resumePath: 1,
                    studentName: { $ifNull: [ "$studentDetails.fullName", "N/A" ] },
                    studentEmail: { $ifNull: [ "$studentDetails.email", "$studentEmail" ] }
                }
            }
        ]);
        res.json(internships);
    } catch (error) {
        console.error("Error fetching internships:", error);
        res.status(500).json({ message: "Server error while fetching internships." });
    }
});

module.exports = router;