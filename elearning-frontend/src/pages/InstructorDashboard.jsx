
import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/courses/instructor", {
        withCredentials: true,
      });
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/courses", newCourse, {
        withCredentials: true,
      });
      setNewCourse({ title: "", description: "" });
      fetchCourses();
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <DashboardLayout role="instructor">
      <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Instructor Dashboard</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Course</h2>
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <input
            type="text"
            placeholder="Course Title"
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Course Description"
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Create Course
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p className="text-gray-600">{course.description}</p>
            <div className="mt-4 flex justify-between">
              <span className="text-sm text-gray-500">
                Students: {course.enrolledStudents?.length || 0}
              </span>
              <button className="text-blue-600 hover:underline">
                Manage Course
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default InstructorDashboard;
