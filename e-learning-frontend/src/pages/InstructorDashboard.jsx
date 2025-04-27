// src/pages/InstructorDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import CourseForm from '../components/CourseForm';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);

  // Fetch courses created by the instructor
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/courses/instructor', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch courses.');
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Courses Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Your Courses</h2>
            <Link to="/create-course" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
              Create Course
            </Link>
          </div>
          {courses.length === 0 ? (
            <p className="text-muted-foreground text-center">No courses created yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} role="instructor"/>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default InstructorDashboard;
