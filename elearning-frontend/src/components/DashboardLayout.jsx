
import React from 'react';
import Navbar from './Navbar';

const DashboardLayout = ({ children, role }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <aside className="w-64 bg-white shadow-md h-screen fixed">
          <nav className="p-4">
            <h2 className="text-xl font-semibold mb-4 capitalize">{role} Menu</h2>
            <ul className="space-y-2">
              {role === 'student' && (
                <>
                  <li><a href="/student/courses" className="text-gray-600 hover:text-blue-600">My Courses</a></li>
                  <li><a href="/student/progress" className="text-gray-600 hover:text-blue-600">Progress</a></li>
                </>
              )}
              {role === 'instructor' && (
                <>
                  <li><a href="/instructor/courses" className="text-gray-600 hover:text-blue-600">My Courses</a></li>
                  <li><a href="/instructor/analytics" className="text-gray-600 hover:text-blue-600">Analytics</a></li>
                </>
              )}
              {role === 'admin' && (
                <>
                  <li><a href="/admin/users" className="text-gray-600 hover:text-blue-600">Users</a></li>
                  <li><a href="/admin/courses" className="text-gray-600 hover:text-blue-600">Courses</a></li>
                </>
              )}
            </ul>
          </nav>
        </aside>
        <main className="ml-64 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
