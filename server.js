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
app.use('/admin',express.static(path.join(__dirname, "admin")));

// Import Routes
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const applicationRoutes = require("./routes/applicationRoutes"); // ✅ ADD THIS
const internshipRoutes = require("./routes/internshipRoutes"); // ✅ ADD THIS LINE

// Use Routes
app.post('/api/students/login', async (req, res) => {
    const { email, password } = req.body;
    // your login logic here
    res.json({ message: 'Login successful', data: { studentId: 123 } });
});

app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/internships", internshipRoutes); // ✅ AND ADD THIS LINE

// MongoDB connection
const mongoURI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/talentnest";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
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

