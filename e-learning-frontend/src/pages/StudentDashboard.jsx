import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  // Fetch enrolled and available courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const enrolledResponse = await axios.get('http://localhost:5000/api/courses/enrolled', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const availableResponse = await axios.get('http://localhost:5000/api/courses');
        setEnrolledCourses(enrolledResponse.data);
        setAvailableCourses(availableResponse.data);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch courses. Please try again.');
      }
    };

    fetchCourses();
  }, []);

  // Enroll in a course
  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/courses/${courseId}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Enrolled successfully');
      window.location.reload(); // Refresh to update the course list
    } catch (error) {
      console.error(error);
      alert('Failed to enroll. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>
      {enrolledCourses.length === 0 ? (
        <p className="text-gray-500">You are not enrolled in any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {enrolledCourses.map((course) => (
            <div key={course._id} className="bg-white p-4 rounded shadow-md space-y-2">
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.description}</p>
              <p className="text-sm text-gray-500">Progress: {course.progress || 0}%</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
      {availableCourses.length === 0 ? (
        <p className="text-gray-500">No courses available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCourses.map((course) => (
            <div key={course._id} className="bg-white p-4 rounded shadow-md space-y-2">
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.description}</p>
              <button
                onClick={() => handleEnroll(course._id)}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition duration-300"
              >
                Enroll
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;