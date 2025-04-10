import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Clock } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import axios from "axios";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/student/courses", {
        withCredentials: true,
      });
      setCourses(res.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <DashboardLayout role="student">
      <div className="py-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Student Dashboard</h1>

        {loading ? (
          <p className="text-gray-500">Loading your courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-500">No enrolled courses yet.</p>
        ) : (
          <>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Continue Learning</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div key={course._id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="h-48 bg-gray-200 relative">
                    <img
                      src={course.thumbnail || "https://via.placeholder.com/300"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <Link to={`/student/courses/${course._id}`} className="bg-white rounded-full p-3">
                        <Play className="h-6 w-6 text-indigo-600" />
                      </Link>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                    {course.instructor?.name && (
                      <p className="text-sm text-gray-500">Instructor: {course.instructor.name}</p>
                    )}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Progress: {course.progress || 0}%
                        </span>
                        <span className="flex items-center text-indigo-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Continue</span>
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${course.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
