// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AIChat from './components/AIChat';
import HomePage from './pages/HomePage';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import CourseManagementPage from './pages/CourseManagementPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import CourseForm from './components/CourseForm';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';

const App = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
        <AIChat />
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Authentication Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/aboutus" element={<AboutPage />} />
    
        {/* Student Dashboard */}
        <Route
          path="/student-dashboard"
          element={
            <PrivateRoute requiredRole="student">
              <StudentDashboard />
            </PrivateRoute>
          }
        />

        {/* Instructor Dashboard */}
        <Route
          path="/instructor-dashboard"
          element={
            <PrivateRoute requiredRole="instructor">
              <InstructorDashboard />
            </PrivateRoute>
          }
        />

        {/* Course Management Page */}
        <Route
          path="/instructor-dashboard/courses/:courseId"
          element={
            <PrivateRoute requiredRole="instructor">
              <CourseManagementPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/course/:courseId"
          element={
            <PrivateRoute requiredRole="student">
              <CourseDetailsPage />
            </PrivateRoute>
          }
        />

        {/* Create Course Page */}
        <Route
          path="/create-course"
          element={
            <PrivateRoute requiredRole="instructor">
              <CourseForm />
            </PrivateRoute>
          }
        />
      </Routes>
      </div>
  );
};

export default App;
