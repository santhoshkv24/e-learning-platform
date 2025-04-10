
import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users", {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/admin/courses", {
        withCredentials: true,
      });
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user._id} className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      {user.role}
                    </span>
                  </div>
                  <button className="text-blue-600 hover:underline">
                    Manage User
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Courses</h2>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course._id} className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-gray-600">
                      Instructor: {course.instructor?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Students: {course.enrolledStudents?.length || 0}
                    </p>
                  </div>
                  <button className="text-blue-600 hover:underline">
                    Manage Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
