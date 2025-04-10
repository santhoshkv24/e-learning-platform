const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

// Middleware to protect routes (you can add auth later)
const authMiddleware = require("../middleware/auth"); // optional placeholder

router.post("/", authMiddleware, createCourse);
router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.put("/:id", authMiddleware, updateCourse);
router.delete("/:id", authMiddleware, deleteCourse);

module.exports = router;
