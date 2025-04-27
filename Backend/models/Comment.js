const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  lecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture', required: true }, // Lecture ID
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User ID
  text: { type: String, required: true }, // Comment text
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);