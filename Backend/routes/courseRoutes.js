const express = require('express');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const fs = require('fs');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Create a course (instructor only)
router.post('/', [authMiddleware, roleMiddleware('instructor'), upload.single('thumbnail')], async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Initialize course object
    const courseData = { 
      title, 
      description, 
      instructor: req.user.id 
    };

    // Upload thumbnail if provided
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        courseData.thumbnailUrl = result.secure_url;
        
        // Delete the file from local storage after upload
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error('Thumbnail upload error:', uploadError);
      }
    }

    const course = new Course(courseData);
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Update course (instructor only)
router.put('/:courseId', [authMiddleware, roleMiddleware('instructor'), upload.single('thumbnail')], async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;

    // Find course and verify ownership
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to update this course' });
    }

    // Update basic info
    if (title) course.title = title;
    if (description) course.description = description;

    // Handle thumbnail upload if provided
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        course.thumbnailUrl = result.secure_url;
        
        // Delete the file from local storage after upload
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error('Thumbnail upload error:', uploadError);
      }
    }

    await course.save();
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Get course details
router.get('/details/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('instructor', 'name email')
      .populate('lectures')
      .select('title description instructor students lectures progress thumbnailUrl createdAt');
    
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    res.json(course);
  } catch (error) {
    console.error('Error fetching course details:', error);
    res.status(500).send('Server error');
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .select('title description instructor students lectures thumbnailUrl');
    res.json(courses);
  } catch (error) {
    console.error('Error fetching all courses:', error);
    res.status(500).send('Server error');
  }
});

// Get courses created by the instructor (instructor only)
router.get('/instructor', [authMiddleware, roleMiddleware('instructor')], async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate('instructor', 'name email')
      .select('title description instructor students lectures thumbnailUrl createdAt');
    res.json(courses);
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    res.status(500).send('Server error');
  }
});

// Get courses enrolled by the student (student only)
router.get('/enrolled', authMiddleware, async (req, res) => {
  try {
    // Find all courses where the student is enrolled
    const courses = await Course.find({ students: req.user.id })
      .populate('instructor', 'name email') // Populate instructor details
      .select('title description instructor students lectures progress thumbnailUrl') // Explicitly select thumbnailUrl
      .populate({
        path: 'lectures', // Populate lecture details
        select: 'title videoUrl notes',
      });

    // Attach progress information for each course
    const enrolledCourses = await Promise.all(courses.map(async (course) => {
      // Find the student's progress entry
      const progressEntry = course.progress.find(p => p.student.toString() === req.user.id);
      
      // Calculate progress percentage
      const totalLectures = course.lectures.length;
      const completedLectures = progressEntry?.completedLectures?.length || 0;
      const progressPercentage = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
      
      // Return course with progress info
      return {
        ...course.toObject(),
        progress: progressPercentage,
        completedLectures: completedLectures,
        totalLectures: totalLectures
      };
    }));

    res.json(enrolledCourses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).send('Server error');
  }
});


// Enroll in a course (student only)
router.post('/:courseId/enroll', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // Check if already enrolled
    if (course.students.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Already enrolled' });
    }

    course.students.push(req.user.id);
    await course.save();
    res.json({ msg: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Add a lecture to a course (instructor only)
router.post('/:courseId/lectures', [authMiddleware, roleMiddleware('instructor'), upload.single('video')], async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, notes } = req.body;

    console.log('Lecture upload request received:', { 
      title, 
      hasVideo: !!req.file,
      fileSize: req.file ? req.file.size : 'No file'
    });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    let videoUrl = null;
    if (req.file) {
      try {
        // Check if Cloudinary is properly configured
        if (!process.env.CLOUDINARY_CLOUD_NAME || 
            !process.env.CLOUDINARY_API_KEY || 
            !process.env.CLOUDINARY_API_SECRET) {
          console.error('Cloudinary configuration missing');
          return res.status(500).json({ msg: 'Server configuration error: Cloudinary not configured' });
        }

        console.log('Uploading video to Cloudinary...', req.file.path);
        
        const videoResult = await cloudinary.uploader.upload(req.file.path, { 
          resource_type: 'video',
          timeout: 120000 // Increase timeout for large videos
        });
        
        console.log('Video upload successful:', videoResult.secure_url);
      videoUrl = videoResult.secure_url;
        
        // Delete the file from local storage after upload
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error('Video upload error details:', uploadError);
        
        // Ensure temp file is removed even if upload fails
        try {
          if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        } catch (cleanupError) {
          console.error('Error cleaning up temp file:', cleanupError);
        }
        
        // Provide more specific error messages based on the error
        if (uploadError.http_code === 400) {
          return res.status(400).json({ 
            msg: 'Video upload failed - invalid format or too large',
            error: uploadError.message 
          });
        } else if (uploadError.http_code === 401) {
          return res.status(500).json({ 
            msg: 'Video upload failed - authentication error with cloud provider',
            error: uploadError.message 
          });
        } else {
          return res.status(400).json({ 
            msg: 'Error uploading video',
            error: uploadError.message 
          });
        }
      }
    }

    // Create lecture even if no video is uploaded
    const lecture = new Lecture({ 
      title, 
      videoUrl, 
      notes: notes || '', 
      course: courseId 
    });
    await lecture.save();

    course.lectures.push(lecture._id);
    await course.save();

    res.json(lecture);
  } catch (error) {
    console.error('Lecture creation error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

// Mark lecture as completed (student only)
router.post('/:courseId/lectures/:lectureId/complete', authMiddleware, async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;

    const course = await Course.findById(courseId)
      .populate('lectures');
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // Verify lecture exists in this course
    const lectureExists = course.lectures.some(lecture => lecture._id.toString() === lectureId);
    if (!lectureExists) {
      return res.status(404).json({ msg: 'Lecture not found in this course' });
    }

    // Check if the user is enrolled in the course
    if (!course.students.includes(req.user.id)) {
      return res.status(403).json({ msg: 'Not enrolled in this course' });
    }

    // Find progress entry index
    const progressIndex = course.progress.findIndex(p => p.student.toString() === req.user.id);
    
    // If no progress entry found, create one
    if (progressIndex === -1) {
      course.progress.push({
        student: req.user.id,
        completedLectures: [lectureId]
      });
    } else {
      // Check if lecture is already marked as completed
      const lectureIndex = course.progress[progressIndex].completedLectures
        .findIndex(id => id.toString() === lectureId);
      
      if (lectureIndex === -1) {
    // Add lecture to completed lectures if not already present
        course.progress[progressIndex].completedLectures.push(lectureId);
      }
    }

    await course.save();
    
    // Recalculate progress percentage
    const progressEntry = course.progress.find(p => p.student.toString() === req.user.id);
    const totalLectures = course.lectures.length;
    const completedLectures = progressEntry.completedLectures.length;
    const progressPercentage = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

    res.json({ 
      msg: 'Lecture marked as completed',
      completedCount: completedLectures,
      totalCount: totalLectures,
      progress: progressPercentage
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Mark lecture as uncompleted (student only)
router.post('/:courseId/lectures/:lectureId/uncomplete', authMiddleware, async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;

    const course = await Course.findById(courseId)
      .populate('lectures');
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // Check if the user is enrolled in the course
    if (!course.students.includes(req.user.id)) {
      return res.status(403).json({ msg: 'Not enrolled in this course' });
    }

    // Find progress entry
    const progressIndex = course.progress.findIndex(p => p.student.toString() === req.user.id);
    if (progressIndex === -1) {
      return res.status(400).json({ msg: 'No progress record found' });
    }
    
    // Remove lecture from completed list
    const completedLectures = course.progress[progressIndex].completedLectures;
    const lectureIndex = completedLectures.findIndex(id => id.toString() === lectureId);
    
    if (lectureIndex !== -1) {
      completedLectures.splice(lectureIndex, 1);
      await course.save();
    }
    
    // Recalculate progress percentage
    const totalLectures = course.lectures.length;
    const completedCount = completedLectures.length;
    const progressPercentage = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

    res.json({ 
      msg: 'Lecture marked as uncompleted',
      completedCount: completedCount,
      totalCount: totalLectures,
      progress: progressPercentage
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Get course progress (student only)
router.get('/:courseId/progress', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate('lectures', '_id title');
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // Check if the user is enrolled in the course
    if (!course.students.includes(req.user.id)) {
      return res.status(403).json({ msg: 'Not enrolled in this course' });
    }

    // Find the student's progress
    const progressEntry = course.progress.find(p => p.student.toString() === req.user.id);
    const totalLectures = course.lectures.length;
    const completedLectures = progressEntry?.completedLectures || [];
    const completedCount = completedLectures.length;
    const progressPercentage = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

    // Create a detailed response with lecture completion status
    const lecturesWithStatus = course.lectures.map(lecture => {
      const isCompleted = completedLectures.some(
        id => id.toString() === lecture._id.toString()
      );
      
      return {
        _id: lecture._id,
        title: lecture.title,
        isCompleted
      };
    });

    res.json({ 
      progress: progressPercentage,
      completedCount,
      totalCount: totalLectures,
      lectures: lecturesWithStatus
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Add a comment to a lecture (student only)
router.post('/:courseId/lectures/:lectureId/comments', authMiddleware, async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const { text } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ msg: 'Lecture not found' });

    // Ensure the lecture belongs to the course
    if (!course.lectures.includes(lectureId)) {
      return res.status(400).json({ msg: 'Lecture does not belong to this course' });
    }

    const comment = new Comment({
      lecture: lectureId,
      user: req.user.id,
      text,
    });

    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Fetch comments for a lecture
router.get('/:courseId/lectures/:lectureId/comments', async (req, res) => {
  try {
    const { lectureId } = req.params;

    const comments = await Comment.find({ lecture: lectureId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
