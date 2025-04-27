// src/components/CommentSection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Input } from './ui/input';
import { Button } from './ui/button';

const CommentSection = ({ lectureId, courseId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Fetch comments for the lecture
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/${courseId}/lectures/${lectureId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch comments.');
      }
    };

    fetchComments();
  }, [lectureId, courseId]);

  // Add a new comment
  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/lectures/${lectureId}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error(error);
      alert('Failed to add comment.');
    }
  };

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-4">Comments</h4>
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
              <p>{comment.text}</p>
              <p className="text-gray-500 text-sm mt-2">By {comment.user.name}</p>
          </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No comments yet. Be the first to add one!</p>
        )}
      </div>
      <div className="mt-6 flex gap-4">
        <Input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1"
        />
        <Button onClick={handleAddComment} disabled={!newComment.trim()}>
          Post
        </Button>
      </div>
    </div>
  );
};

export default CommentSection;
