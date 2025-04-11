// routes/progressRoutes.js
const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/auth');

// Mark a lecture as completed (student only)
router.post('/:courseId/:lectureId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const { courseId, lectureId } = req.params;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // Find or create the progress record for the user and course
    let progress = await Progress.findOne({ user: req.user.id, course: courseId });

    if (!progress) {
      progress = new Progress({
        user: req.user.id,
        course: courseId,
        completedLectures: [],
      });
    }

    // Add the lecture to completedLectures if not already present
    if (!progress.completedLectures.includes(lectureId)) {
      progress.completedLectures.push(lectureId);
    }

    await progress.save();

    res.json(progress);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get progress for a course (student only)
router.get('/:courseId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const { courseId } = req.params;

    // Find the progress record for the user and course
    const progress = await Progress.findOne({ user: req.user.id, course: courseId })
      .populate('completedLectures')
      .exec();

    if (!progress) {
      return res.status(404).json({ msg: 'No progress found for this course' });
    }

    res.json(progress);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;