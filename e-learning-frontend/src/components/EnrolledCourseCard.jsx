// src/components/EnrolledCourseCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const EnrolledCourseCard = ({ course }) => {
  const defaultImage = 'https://via.placeholder.com/400x200?text=No+Thumbnail';
  const progress = course.progress || 0;
  
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-sm border overflow-hidden">
      <div className="relative">
        <img 
          src={course.thumbnailUrl || defaultImage} 
          alt={course.title} 
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-4">
            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
            <p className="text-muted-foreground line-clamp-3">
              {course.description}
            </p>
          </div>
          <div className="w-16 h-16 flex-shrink-0">
            <CircularProgressbar
              value={progress}
              text={`${progress}%`}
              styles={buildStyles({
                textSize: '24px',
                pathColor: '#10b981',
                textColor: '#111827',
                trailColor: '#d6d6d6',
                backgroundColor: '#fff',
              })}
            />
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="text-sm text-muted-foreground mb-4">
            {course.lectures?.length || 0} lecture{course.lectures?.length !== 1 ? 's' : ''}
          </div>
          
          <div className="flex justify-end">
            <Button asChild>
              <Link to={`/course/${course._id}`}>Continue Learning</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseCard;
