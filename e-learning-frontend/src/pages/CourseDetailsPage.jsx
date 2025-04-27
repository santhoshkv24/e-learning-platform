// src/pages/CourseDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import LectureContent from '../components/LectureContent';
import { Button } from '../components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const CourseDetailsPage = () => {
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedLectureIndex, setSelectedLectureIndex] = useState(0);
  const { courseId } = useParams();

  // Fetch course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/courses/details/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(response.data);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch course details.');
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleLectureCompleted = (updatedProgress) => {
    setProgress(updatedProgress);
  };

  const handleLectureSelect = (lecture) => {
    const index = course.lectures.findIndex(l => l._id === lecture._id);
    if (index !== -1) {
      setSelectedLectureIndex(index);
    }
  };

  const goToNextLecture = () => {
    if (selectedLectureIndex < course.lectures.length - 1) {
      setSelectedLectureIndex(selectedLectureIndex + 1);
    }
  };

  const goToPreviousLecture = () => {
    if (selectedLectureIndex > 0) {
      setSelectedLectureIndex(selectedLectureIndex - 1);
    }
  };

  if (!course) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12">
          <p className="text-foreground text-center">Loading...</p>
        </div>
      </Layout>
    );
  }

  const selectedLecture = course.lectures[selectedLectureIndex];

  return (
    <Layout>
      {/* Course Header */}
      <section>
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{course.title}</h1>
        </div>
      </section>

      {/* Lecture Navigation */}
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={goToPreviousLecture}
          disabled={selectedLectureIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous Lecture
        </Button>
        
        <span className="text-sm text-muted-foreground">
          Lecture {selectedLectureIndex + 1} of {course.lectures.length}
        </span>
        
        <Button 
          variant="outline" 
          onClick={goToNextLecture}
          disabled={selectedLectureIndex === course.lectures.length - 1}
          className="flex items-center gap-2"
        >
          Next Lecture
          <ArrowRight className="h-4 w-4" />
        </Button>
    </div>

      {/* Lecture Content with YouTube-like Layout */}
      {selectedLecture && (
        <LectureContent 
          lecture={selectedLecture} 
          courseId={courseId} 
          onLectureCompleted={handleLectureCompleted}
          allLectures={course.lectures}
          onLectureSelect={handleLectureSelect}
        />
      )}
    </Layout>
  );
};

export default CourseDetailsPage;
