// models/Progress.js
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  completedLectures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecture',
    },
  ],
});

module.exports = mongoose.model('Progress', progressSchema);