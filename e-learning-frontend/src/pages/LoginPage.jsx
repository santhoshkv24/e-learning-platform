import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending login request:', { email, password }); // Debugging
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      console.log('Login response:', response.data); // Debugging
      localStorage.setItem('token', response.data.token);
      navigate('/student/dashboard');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message); // Debugging
      alert('Login failed: ' + (error.response?.data?.msg || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center text-primary">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />
        <button
          type="submit"
          className="w-full  rounded transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;