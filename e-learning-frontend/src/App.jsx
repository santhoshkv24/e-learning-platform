// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/instructor/dashboard" element={<InstructorDashboard />} />

      {/* Redirect to Login by default */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;