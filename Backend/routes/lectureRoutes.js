const upload = require("../middleware/upload");
const express = require("express");
const Lecture = require("../models/Lecture");
const Course = require("../models/Course");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Upload Lecture Video File
router.post("/:courseId/upload", authMiddleware, upload.single("video"), async (req, res) => {
    try {
      const { title } = req.body;
      const { courseId } = req.params;
  
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  
      const lecture = new Lecture({
        title,
        videoUrl: `/uploads/${req.file.filename}`,
        course: courseId,
      });
  
      await lecture.save();
      res.status(201).json({ message: "Lecture uploaded", lecture });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  

// Add Lecture to a Course
router.post("/:courseId", authMiddleware, async (req, res) => {
  try {
    const { title, videoUrl } = req.body;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lecture = new Lecture({ title, videoUrl, course: courseId });
    await lecture.save();

    res.status(201).json({ message: "Lecture added", lecture });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get Lectures of a Course
router.get("/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;

    const lectures = await Lecture.find({ course: courseId });
    res.json({ lectures });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a Lecture
router.delete("/:lectureId", authMiddleware, async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    res.json({ message: "Lecture deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
