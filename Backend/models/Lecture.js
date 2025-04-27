const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  videoUrl: { 
    type: String 
  },
  notes: {
    type: String,
    default: ''
  },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('Lecture', lectureSchema);
