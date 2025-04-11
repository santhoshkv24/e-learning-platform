// models/Lecture.js
const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  pdfUrl: {
    type: String,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // References the Course model
    required: true,
  },
});

module.exports = mongoose.model('Lecture', lectureSchema);