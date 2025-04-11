// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const authMiddleware = require('../middleware/auth');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');

// Configure Multer for temporary file storage
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Create a course (instructor only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const { title, description } = req.body;

    const course = new Course({
      title,
      description,
      instructor: req.user.id,
    });

    await course.save();
    res.json(course);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    res.json(courses);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get courses created by the instructor (instructor only)
router.get('/instructor', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const courses = await Course.find({ instructor: req.user.id }).populate('instructor', 'name email');
    res.json(courses);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Add a lecture to a course (instructor only)
router.post('/:courseId/lectures', authMiddleware, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const { courseId } = req.params;
    const { title } = req.body;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // Check if the user is the course instructor
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    // Upload video to Cloudinary
    let videoUrl = null;
    if (req.files['video']) {
      const videoResult = await cloudinary.uploader.upload(req.files['video'][0].path, {
        resource_type: 'video',
      });
      videoUrl = videoResult.secure_url;
    }

    // Upload PDF to Cloudinary
    let pdfUrl = null;
    if (req.files['pdf']) {
      const pdfResult = await cloudinary.uploader.upload(req.files['pdf'][0].path, {
        resource_type: 'auto',
      });
      pdfUrl = pdfResult.secure_url;
    }

    // Create a new lecture
    const lecture = new Lecture({
      title,
      videoUrl,
      pdfUrl,
      course: courseId,
    });

    await lecture.save();

    // Add the lecture to the course
    course.lectures.push(lecture._id);
    await course.save();

    res.json(lecture);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Update a course (instructor only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const { title, description } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ msg: 'Course not found' });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    course.title = title || course.title;
    course.description = description || course.description;

    await course.save();
    res.json(course);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Delete a course (instructor only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ msg: 'Course not found' });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await course.remove();
    res.json({ msg: 'Course deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;