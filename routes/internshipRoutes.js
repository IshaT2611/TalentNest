// routes/internshipRoutes.js
const express = require('express');
const router = express.Router();
// This line will now work because you created the file in Step 1
const InternshipApplication = require('../models/InternshipApplication'); 
const Student = require('../models/Student'); 
const multer = require('multer');
const path = require('path');

// --- Multer Storage Configuration ---
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
    
    // This will print the form data to your terminal for debugging
    console.log("Internship form data received (req.body):", req.body);

    try {
        // This line now includes 'cgpa'
        const { email, name, rollDivision, phone, branch, year, internshipType, cgpa } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required." });
        }

        let student = await Student.findOne({ email: email });
        if (!student) {
            student = new Student({
                fullName: name,
                email: email,
                username: email.split('@')[0],
                rollNumber: rollDivision,
                phoneNumber: phone,
                password: "defaultPassword",
                // ... other student fields
            });
            await student.save();
        }

        const newInternship = new InternshipApplication({
            studentEmail: student.email,
            branch: branch,
            yearOfStudy: year,
            internshipType: internshipType,
            resumePath: req.file.path,
            CGPA: cgpa // This saves the CGPA
        });

        await newInternship.save();
        res.status(201).json({ message: "Internship application submitted successfully!" });

    } catch (error) {
        console.error("Error submitting internship application:", error);
        res.status(500).json({ message: "Server error during application." });
    }
});

// Route to GET all internship applications for the admin panel
router.get('/', async (req, res) => {
    try {
        const internships = await InternshipApplication.aggregate([
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
                    branch: 1,
                    yearOfStudy: 1,
                    internshipType: 1,
                    applicationDate: 1,
                    resumePath: 1,
                    CGPA: 1, // This sends the CGPA to the admin panel
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