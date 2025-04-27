// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnrolledCourseCard from '../components/EnrolledCourseCard';
import AvailableCourseCard from '../components/AvailableCourseCard';

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  // Fetch enrolled courses
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/courses/enrolled', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrolledCourses(response.data);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch enrolled courses.');
      }
    };

    fetchEnrolledCourses();
  }, []);

  // Fetch available courses
  useEffect(() => {
    const fetchAvailableCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/courses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailableCourses(response.data);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch available courses.');
      }
    };

    fetchAvailableCourses();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Enrolled Courses Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground mb-8">Enrolled Courses</h2>
          {enrolledCourses.length === 0 ? (
            <p className="text-muted-foreground text-center">No courses enrolled.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <EnrolledCourseCard key={course._id} course={course} role="student"/>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Available Courses Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground mb-8">Available Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map((course) => (
              <AvailableCourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default StudentDashboard;
