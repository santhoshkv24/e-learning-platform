
const express = require("express");
const router = express.Router();
const { getAllUsers, getAllCourses } = require("../controllers/adminController");
const authMiddleware = require("../middleware/auth");

router.get("/users", authMiddleware, getAllUsers);
router.get("/courses", authMiddleware, getAllCourses);

module.exports = router;
