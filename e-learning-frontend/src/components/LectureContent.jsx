import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';
import CommentSection from './CommentSection';
import ProgressTracker from './ProgressTracker';
import { Button } from './ui/button';
import { PlayCircle, ChevronDown, ChevronUp } from 'lucide-react';

const LectureContent = ({ lecture, courseId, onLectureCompleted, allLectures = [], onLectureSelect }) => {
  const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);
  const [showFullNotes, setShowFullNotes] = useState(false);
  const playerRef = useRef(null);

  const handleProgressUpdate = (progress) => {
    if (onLectureCompleted) {
      onLectureCompleted(progress);
    }
  };

  const formatNotes = (notesText) => {
    if (!notesText) return '';
    return notesText
      .split('\n')
      .map((line, i) => (
        <React.Fragment key={i}>
          {line || ' '}
          {i < notesText.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
  };

  const handleMarkCompleted = async () => {
    setIsMarkingCompleted(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/course/${courseId}/lecture/${lecture._id}/complete`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark lecture as completed');
      }

      const data = await response.json();
      if (onLectureCompleted) {
        onLectureCompleted(data.progress);
      }

      toast.success('Lecture marked as completed');
    } catch (error) {
      toast.error('Failed to mark lecture as completed');
    } finally {
      setIsMarkingCompleted(false);
    }
  };

  const getNotesPreview = (notes) => {
    if (!notes) return '';
    const lines = notes.split('\n').slice(0, 5);
    return lines.join('\n');
  };

  const playerOptions = {
    controls: [
      'play-large', 'play', 'progress', 'current-time', 'duration',
      'mute', 'volume', 'settings', 'pip', 'airplay', 'fullscreen'
    ],
    settings: ['captions', 'quality', 'speed'],
    autoplay: false,
    muted: false,
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-4">{lecture.title}</h3>

              <ProgressTracker 
                courseId={courseId} 
                lectureId={lecture._id} 
                onProgressUpdate={handleProgressUpdate}
              />

              {lecture.videoUrl && (
                <div className="rounded-lg overflow-hidden mb-4">
                  <div className="relative aspect-video bg-black">
                    <Plyr
                      ref={playerRef}
                      source={{
                        type: 'video',
                        sources: [
                          {
                            src: lecture.videoUrl,
                            type: 'video/mp4',
                          },
                        ],
                      }}
                      options={playerOptions}
                      style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {lecture.notes && lecture.notes.trim() !== '' && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Lecture Notes</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowFullNotes(!showFullNotes)}
                  className="flex items-center gap-1 text-sm"
                >
                  {showFullNotes ? 'View Less' : 'View More'}
                  {showFullNotes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              <div className="prose max-w-none whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                {formatNotes(showFullNotes ? lecture.notes : getNotesPreview(lecture.notes))}
                {!showFullNotes && lecture.notes.split('\n').length > 5 && (
                  <div className="mt-2 text-center">
                    <div className="h-6 bg-gradient-to-t from-gray-50 to-transparent"></div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <CommentSection lectureId={lecture._id} courseId={courseId} />
          </div>
        </div>

        <div className="w-full lg:w-1/4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold">Lecture List</h3>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {allLectures.map((item, index) => (
                <button 
                  key={item._id} 
                  onClick={() => onLectureSelect(item)}
                  className={`w-full text-left p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${item._id === lecture._id ? 'bg-gray-100' : ''} border-b border-gray-100`}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {item.videoUrl && <PlayCircle className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-2">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-1">Lecture {index + 1}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureContent;
