import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LectureCard from '../components/LectureCard';
import CommentSection from '../components/CommentSection';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { AlertCircle } from 'lucide-react';

const CourseManagementPage = () => {
  const [course, setCourse] = useState(null);
  const [showLectureForm, setShowLectureForm] = useState(false);
  const [newLecture, setNewLecture] = useState({
    title: '',
    videoFile: null,
    notes: ''
  });
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { courseId } = useParams();

  const MAX_VIDEO_SIZE_MB = 50; // 50 MB max size for videos

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_VIDEO_SIZE_MB) {
        setErrorMessage(`Video file is too large. Maximum size is ${MAX_VIDEO_SIZE_MB}MB.`);
        return;
      }
      
      setNewLecture({...newLecture, videoFile: file});
      setErrorMessage('');
    }
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();
    setUploading(true);
    setErrorMessage('');
    
    // Basic validation
    if (!newLecture.title.trim()) {
      setErrorMessage('Lecture title is required');
      setUploading(false);
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('title', newLecture.title);
      formData.append('notes', newLecture.notes || '');
      
      if (newLecture.videoFile) {
        formData.append('video', newLecture.videoFile);
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/lectures`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          // Add timeout for large video uploads
          timeout: 180000 // 3 minutes
        }
      );

      // Update the course state with the new lecture
      setCourse({
        ...course,
        lectures: [...course.lectures, response.data]
      });

      // Reset form
      setNewLecture({
        title: '',
        videoFile: null,
        notes: ''
      });
      setShowLectureForm(false);
    } catch (error) {
      console.error('Lecture upload error:', error);
      
      // Extract detailed error message
      if (error.response?.data) {
        const { msg, error: detailedError } = error.response.data;
        setErrorMessage(msg || 'Failed to add lecture');
        
        if (detailedError) {
          console.error('Detailed error:', detailedError);
        }
      } else if (error.code === 'ECONNABORTED') {
        setErrorMessage('Upload timed out. Your video might be too large.');
      } else {
        setErrorMessage('Failed to add lecture. Please try again later.');
      }
    } finally {
      setUploading(false);
    }
  };

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
        setErrorMessage('Failed to fetch course details.');
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (!course) {
    return <p className="text-white text-center">Loading...</p>;
  }

  return (
    <div>
      <Navbar />
      <section className="py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-foreground mb-4">{course.title}</h1>
          <p className="text-muted-foreground mb-4">{course.description}</p>
          <p className="text-muted-foreground">Enrolled Students: {course.students.length}</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Lectures</h2>
            <Button onClick={() => {
              setShowLectureForm(!showLectureForm);
              setErrorMessage('');
            }}>
              {showLectureForm ? 'Cancel' : 'Add Lecture'}
            </Button>
          </div>
          {showLectureForm && (
            <div className="bg-card p-6 rounded-lg shadow-sm border mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Add New Lecture</h3>
              
              {errorMessage && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
              
              <form onSubmit={handleAddLecture} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Lecture Title</label>
                  <Input
                    value={newLecture.title}
                    onChange={(e) => setNewLecture({...newLecture, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Video File <span className="text-xs text-muted-foreground">(Max {MAX_VIDEO_SIZE_MB}MB)</span>
                  </label>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  <p className="text-xs text-muted-foreground">Supported formats: MP4, WebM, MOV (Optional)</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Lecture Notes</label>
                  <Textarea
                    value={newLecture.notes}
                    onChange={(e) => setNewLecture({...newLecture, notes: e.target.value})}
                    placeholder="Enter lecture notes (optional)..."
                  />
                </div>
                <Button type="submit" disabled={uploading}>
                  {uploading ? 'Uploading... Please wait' : 'Add Lecture'}
                </Button>
              </form>
            </div>
          )}
          <div className="space-y-6">
            {course.lectures && course.lectures.length > 0 ? (
              course.lectures.map((lecture) => (
              <LectureCard key={lecture._id} lecture={lecture} courseId={courseId} />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">No lectures yet. Add your first lecture above.</p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CourseManagementPage;
