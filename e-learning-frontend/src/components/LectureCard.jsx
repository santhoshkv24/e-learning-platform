// src/components/LectureCard.jsx


import React, { useRef } from 'react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';
import CommentSection from './CommentSection';

const LectureCard = ({ lecture, courseId }) => {
  const playerRef = useRef(null);

  const plyrOptions = {
    controls: [
      'play-large', 
      'play', 
      'progress', 
      'current-time', 
      'mute', 
      'volume', 
      'fullscreen'
    ],
    settings: [],
    autoplay: false,
    volume: 0.8,
    muted: false,
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-sm border overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">{lecture.title}</h3>

        {/* Video Player */}
        {lecture.videoUrl && (
          <div className="rounded-lg overflow-hidden mb-6 border shadow-sm">
            <div className="relative aspect-video bg-black">
              <Plyr
                ref={playerRef}
                source={{
                  type: 'video',
                  sources: [
                    {
                      src: lecture.videoUrl,
                      provider: 'html5',
                    },
                  ],
                }}
                options={plyrOptions}
              />
            </div>
          </div>
        )}

        {/* Comment Section */}
        <div className="mt-6">
          <CommentSection lectureId={lecture._id} courseId={courseId} />
        </div>
      </div>
    </div>
  );
};

export default LectureCard;
