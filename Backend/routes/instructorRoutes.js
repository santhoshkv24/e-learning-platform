
const express = require("express");
const router = express.Router();
const { getInstructorCourses } = require("../controllers/instructorController");
const authMiddleware = require("../middleware/auth");

router.get("/courses", authMiddleware, getInstructorCourses);

module.exports = router;
