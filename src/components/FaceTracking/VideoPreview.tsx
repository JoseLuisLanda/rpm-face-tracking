import React from 'react';

const VideoPreview: React.FC = () => {
  return (
    <video 
      className="camera-feed" 
      id="video" 
      autoPlay 
      playsInline 
      muted
    ></video>
  );
};

export default VideoPreview;