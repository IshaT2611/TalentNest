const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: String,
  username: String,
  email: String,
  phoneNumber: String,
  uid: String,
  rollNumber: String,
  department: String,
  yearOfStudy: String,
  division: String,
  gender: String,
  password: String,
  
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
