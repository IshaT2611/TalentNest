// routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const multer = require('multer');
const path = require('path');
const Student = require('../models/Student'); 

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/resumes/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route to handle new job applications from the form
router.post('/apply', upload.single('resume'), async (req, res) => {
    
    // 👇 --- NEW DIAGNOSTIC LINE --- 👇
    console.log("Form data received (req.body):", req.body);
    // 👆 --- END OF NEW LINE --- 👆

    try {
        // This line MUST include 'cgpa'
        const { email, name, gender, rollDivision, phone, companyName, role, cgpa } = req.body;

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
                division: "Not Specified", 
                skills: [],
            });
            await student.save();
        }

        const newApplication = new Application({
            studentEmail: student.email,
            company: companyName,
            jobTitle: role,
            resumePath: req.file.path,
            // This line MUST set 'CGPA' from the 'cgpa' variable
            CGPA: cgpa 
        });

        await newApplication.save();
        res.status(201).json({ message: "Application submitted successfully!" });

    } catch (error) {
        // This is line 67 from your log
        console.error("Error submitting application:", error);
        res.status(500).json({ message: "Server error during application." });
    }
});

// Existing GET all job applications route
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
                    resumePath: 1,
                    studentName: { $ifNull: [ "$studentDetails.fullName", "N/A" ] },
                    studentEmail: { $ifNull: [ "$studentDetails.email", "$studentEmail" ] },
                    CGPA: 1 
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