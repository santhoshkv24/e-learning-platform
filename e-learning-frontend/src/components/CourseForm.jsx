import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CourseForm = ({ initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(initialData?.thumbnailUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use FormData to handle file upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      let response;
      if (initialData) {
        // Update existing course
        response = await axios.put(
          `http://localhost:5000/api/courses/${initialData._id}`, 
          formData, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        navigate(`/instructor-dashboard/courses/${initialData._id}`);
      } else {
        // Create new course
        response = await axios.post(
          'http://localhost:5000/api/courses', 
          formData, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        navigate(`/instructor-dashboard/courses/${response.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error saving course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-sm border">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        {initialData ? 'Edit Course' : 'Create New Course'}
      </h2>
      
      {error && <p className="text-destructive text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Course Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Thumbnail Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
          
          {thumbnailPreview && (
            <div className="mt-2">
              <p className="text-sm mb-1">Preview:</p>
              <img 
                src={thumbnailPreview} 
                alt="Thumbnail preview" 
                className="w-full max-h-48 object-cover rounded-md" 
              />
            </div>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Course' : 'Create Course')}
        </Button>
      </form>
    </div>
  );
};

export default CourseForm;
