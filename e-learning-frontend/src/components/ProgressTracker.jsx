// src/components/ProgressTracker.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProgressTracker = ({ courseId, lectureId, onProgressUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [courseProgress, setCourseProgress] = useState({
    progress: 0,
    completedCount: 0,
    totalCount: 0,
    lectureCompleted: false
  });
  
  // Get current progress when component mounts or lectureId changes
  useEffect(() => {
    fetchProgress();
  }, [courseId, lectureId]);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/courses/${courseId}/progress`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const { progress, completedCount, totalCount, lectures } = response.data;
      const lectureCompleted = lectures.find(lec => lec._id === lectureId)?.isCompleted || false;
      
      setCourseProgress({
        progress,
        completedCount,
        totalCount,
        lectureCompleted
      });
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      setError('Failed to load progress data');
    }
  };

  const handleToggleCompletion = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const endpoint = courseProgress.lectureCompleted ? 'uncomplete' : 'complete';
      
      const response = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/lectures/${lectureId}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the local state with new progress data
      const { progress, completedCount, totalCount } = response.data;
      setCourseProgress({
        progress,
        completedCount,
        totalCount,
        lectureCompleted: !courseProgress.lectureCompleted
      });
      
      // Notify parent component about the update
      if (onProgressUpdate) {
        onProgressUpdate(progress);
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
      setError('Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-muted/10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16">
            <CircularProgressbar
              value={courseProgress.progress}
              text={`${courseProgress.progress}%`}
              styles={buildStyles({
                textSize: '22px',
                pathColor: `rgba(62, 152, 199, ${courseProgress.progress / 100})`,
                textColor: '#3e98c7',
                trailColor: '#d6d6d6',
              })}
            />
          </div>
          
          <div>
            <h3 className="font-medium">Course Progress</h3>
            <p className="text-sm text-muted-foreground">
              {courseProgress.completedCount} of {courseProgress.totalCount} lectures completed
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleToggleCompletion}
          disabled={loading}
          variant={courseProgress.lectureCompleted ? "outline" : "default"}
        >
          {loading ? 'Updating...' : (courseProgress.lectureCompleted ? 'Mark as Incomplete' : 'Mark as Complete')}
        </Button>
      </div>
      
      {error && <p className="text-destructive text-sm mt-2">{error}</p>}
    </div>
  );
};

export default ProgressTracker;
