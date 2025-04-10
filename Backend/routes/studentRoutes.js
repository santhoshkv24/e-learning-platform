
const express = require("express");
const router = express.Router();
const { getEnrolledCourses } = require("../controllers/studentController");
const authMiddleware = require("../middleware/auth");

router.get("/courses", authMiddleware, getEnrolledCourses);

module.exports = router;
