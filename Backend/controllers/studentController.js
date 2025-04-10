
const Course = require("../models/Course");
const User = require("../models/User");

exports.getStudentCourses = async (req, res) => {
  try {
    const studentId = req.user._id;

    const student = await User.findById(studentId).populate({
      path: "enrolledCourses",
      populate: {
        path: "instructor",
        select: "name",
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const courses = student.enrolledCourses.map((course) => ({
      _id: course._id,
      title: course.title,
      thumbnail: course.thumbnail,
      instructor: course.instructor ? { name: course.instructor.name } : null,
    }));

    res.json(courses);
  } catch (error) {
    console.error("Error fetching student courses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({ enrolledStudents: req.user.id })
      .populate("instructor", "name")
      .select("title description thumbnail progress");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
