// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));
app.use('/admin', express.static(path.join(__dirname, "admin")));

// 👇 --- FIX #1: ADD THIS LINE --- 👇
// This makes resume files in the 'uploads' folder accessible via URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// 👆 --- END OF FIX --- 👆

// Import Routes
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const internshipRoutes = require("./routes/internshipRoutes"); 

// Use Routes
app.post('/api/students/login', async (req, res) => {
    // Note: It's better to move this logic into your 'studentRoutes.js'
    const { email, password } = req.body;
    // your login logic here
    res.json({ message: 'Login successful', data: { studentId: 123 } });
});

app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/internships", internshipRoutes); 

// MongoDB connection
const mongoURI =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/talentnest";
mongoose
    // 👇 --- FIX #2: REMOVED DEPRECATED OPTIONS --- 👇
    .connect(mongoURI) 
    // 👆 --- END OF FIX --- 👆
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Default routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html"));
});
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'adminLogin.html'));
});

// Test endpoint
app.get("/api/data", (req, res) => {
    res.json({ message: "Server is running fine!" });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));