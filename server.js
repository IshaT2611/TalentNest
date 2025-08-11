const dotenv = require("dotenv");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

//import your routes and models
const studentRoutes = require('./routes/studentRoutes');
const User = require('./models/User');
const Admin = require('./models/Admin');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/edulinkDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));


//route for homepage
app.get('/', (req, res) => {
    res.send('Welcome to EduLink Backend!');

});
// Admin Routes - this should come AFTER app is initialized!
app.use('/admin', adminRoutes);

// Serve frontend files from "frontend" folder
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});
// Serve admin folder statically
app.use('/admin', express.static(__dirname + '/admin'));
app.get('/admin/home.html', (req, res) => {
  res.sendFile(__dirname + '/admin/home.html');
});

// Registration Route

app.post('/register', async (req, res) => {
  const { name, email, password, gender, skills } = req.body;

  try {
       let skillsArray = [];

    if (typeof skills === 'string') {
      skillsArray = skills.split(',').map(skill => skill.trim());
    } else if (Array.isArray(skills)) {
      skillsArray = skills;
    }


      const newUser = new User({ name, email, password, gender, skills: skillsArray });
      await newUser.save();
      
      console.log("✅ Registration successful:", newUser);
       console.log("✅ Sending JSON response to frontend...");
    res.status(200).json({ message: "Registration successful!" });

  } catch (err) {
      console.error("❌ Registration Failed:", err);
      res.status(400).send(`Registration Failed: ${err.message}`);
  }
});

  
// Login Route

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });

      if (!user || user.password !== password) {
          return res.send('Invalid Email or Password');
      }

      // If credentials are correct
      res.redirect(`/dashboard?name=${user.name}&gender=${user.gender}`);

  } catch (err) {
      res.send('Server Error');
  }
});

app.get('/getUser/:name', async (req, res) => {
  const userName = req.params.name;

  try {
      const user = await User.findOne({ name: userName });

      if (!user) {
          return res.status(404).json({ error: "User not found!" });
      }

      res.json(user);

  } catch (error) {
      console.error("❌ Error fetching user:", error);
      res.status(500).json({ error: "Server error while fetching user" });
  }
});



// Serve the dashboard.html file
app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});



app.post('/updateSkills', async (req, res) => {
  try {
    const { name, skills } = req.body;

    if (!name || !skills) {
        return res.status(400).json({ error: "❌ Name and skills are required!" });
    }

    const user = await User.findOne({ name });  // ✅ Works fine now

    if (!user) {
        return res.status(404).json({ error: "User not found!" });
    }

    const skillsArray = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim());

    const updatedUser = await User.findOneAndUpdate(
      { name }, 
      { $set: { skills: skillsArray } },
      { new: true }  // Returns the updated document
    );
    console.log("✅ Updated user:", updatedUser);

    console.log("✅ Skills Updated Successfully:", user);
    res.json({ message: "✅ Skills updated successfully!" });

} catch (error) {
    console.error("❌ Error updating skills:", error);
    res.status(500).json({ error: "Error updating skills" });
    
}
});
  




//route to open html pages
app.get('/admin/register.html', (req, res) => {
  res.sendFile(__dirname + '/admin/adminRegister.html');
});

app.get('/admin/login.html', (req, res) => {
  res.sendFile(__dirname + '/admin/adminLogin.html');
});

// Example API Endpoint
app.get('/api/data', (req, res) => {
    res.json({ message: 'Backend connected successfully!' });
});



// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
