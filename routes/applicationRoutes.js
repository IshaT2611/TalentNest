// routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const Application = require('../models/Application'); // Import Application model
const multer = require('multer'); // 👈 ADD THIS LINE
const path = require('path');     // 👈 AND ADD THIS LINE
const Student = require('../models/Student'); // 👈 ADD THIS IMPORT

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // The destination folder for resumes
        cb(null, 'uploads/resumes/');
    },
    filename: function (req, file, cb) {
        // Create a safe, unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Route to handle new job applications from the form
router.post('/apply', upload.single('resume'), async (req, res) => {
    try {
        const { email, name, gender, rollDivision, phone, companyName, role } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required." });
        }

        let student = await Student.findOne({ email: email });

        if (!student) {
            student = new Student({
                fullName: name,
                email: email,
                username: email.split('@')[0],
                gender: gender,
                rollNumber: rollDivision,
                phoneNumber: phone,
                password: "defaultPassword",
                department: "Not Specified",
                yearOfStudy: "Not Specified",
                division: "Not Specified", // You can parse this from rollDivision if needed
                skills: [],
            });
            await student.save();
        }

        const newApplication = new Application({
            studentEmail: student.email,
            company: companyName, // ✅ Ensure this uses companyName from the form
            jobTitle: role,       // ✅ Ensure this uses role from the form
            resumePath: req.file.path
        });

        await newApplication.save();
        res.status(201).json({ message: "Application submitted successfully!" });

    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ message: "Server error during application." });
    }
});

// Existing GET all job applications route (from previous help)
router.get('/', async (req, res) => {
    try {
        const applications = await Application.aggregate([
            { $sort: { applicationDate: -1 } },
            {
                $lookup: {
                    from: 'students',
                    localField: 'studentEmail',
                    foreignField: 'email',
                    as: 'studentDetails'
                }
            },
            {
                $unwind: { path: '$studentDetails', preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    _id: 1,
                    company: 1,
                    jobTitle: 1,
                    applicationDate: 1,
                    resumePath: 1, // Make sure to include the resume path
                    studentName: { $ifNull: [ "$studentDetails.fullName", "N/A" ] },
                    studentEmail: { $ifNull: [ "$studentDetails.email", "$studentEmail" ] }
                }
            }
        ]);
        res.json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Server error while fetching applications." });
    }
});

module.exports = router;