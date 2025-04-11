import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });
  const [file, setFile] = useState(null);

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
        alert('Failed to fetch courses. Please try again.');
      }
    };

    fetchCourses();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  // Create a new course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/courses',
        newCourse,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses([...courses, response.data]);
      setNewCourse({ title: '', description: '' }); // Reset form
      alert('Course created successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to create course. Please try again.');
    }
  };

  // Upload content for a course
  const handleUploadContent = async (courseId) => {
    if (!file) {
      return alert('Please select a file to upload');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/courses/${courseId}/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('File uploaded successfully');
      window.location.reload(); // Refresh to update the course list
    } catch (error) {
      console.error(error);
      alert('Failed to upload file. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>

      {/* Course Creation Form */}
      <form onSubmit={handleCreateCourse} className="mb-6 space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={newCourse.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Course Description"
          value={newCourse.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition duration-300"
        >
          Create Course
        </button>
      </form>

      {/* List of Courses */}
      {courses.length === 0 ? (
        <p className="text-gray-500">You have not created any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white p-4 rounded shadow-md space-y-2">
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.description}</p>
              <div className="flex justify-between">
                <label htmlFor={`file-${course._id}`} className="bg-primary text-white px-4 py-2 rounded cursor-pointer">
                  Upload Content
                </label>
                <input
                  id={`file-${course._id}`}
                  type="file"
                  accept=".pdf, video/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    handleUploadContent(course._id);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;