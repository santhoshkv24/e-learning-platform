
const Course = require("../models/Course");

exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate("instructor", "name")
      .populate("enrolledStudents", "name");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
