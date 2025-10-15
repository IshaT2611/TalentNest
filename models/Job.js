const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  type: { type: String, enum: ['job', 'internship'] },
  description: String,
  postedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
