// src/components/AvailableCourseCard.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { toast } from 'sonner';

const AvailableCourseCard = ({ course }) => {
  const [enrolling, setEnrolling] = useState(false);
  const defaultImage = 'https://via.placeholder.com/400x200?text=No+Thumbnail';

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/courses/${course._id}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Enrolled successfully!');
      setTimeout(() => window.location.reload(), 1000); // Refresh after toast
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.msg || 'Failed to enroll';
      toast.error(errorMsg);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-sm border overflow-hidden">
      <img 
        src={course.thumbnailUrl || defaultImage} 
        alt={course.title} 
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = defaultImage;
        }}
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {course.description}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {course.lectures?.length || 0} lecture{course.lectures?.length !== 1 ? 's' : ''}
          </p>
          <Button 
            onClick={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? 'Enrolling...' : 'Enroll Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AvailableCourseCard;
