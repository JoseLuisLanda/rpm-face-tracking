import React from 'react';
import { useTracking } from '../../context/FaceTrackingContext';
import { useAvatar } from '../../context/AvatarContext';

const StatusPanel: React.FC = () => {
  const { isTracking } = useTracking();
  const { isModelLoaded } = useAvatar();

  return (
    <div id="status-container" className="status-container">
      <div className={`status-indicator ${isTracking ? 'active' : ''}`}>
        {isTracking ? 'Tracking Active' : 'Initializing Tracking...'}
      </div>
      <div className={`status-indicator ${isModelLoaded ? 'active' : ''}`}>
        {isModelLoaded ? 'Model Loaded' : 'Default Model'}
      </div>
    </div>
  );
};

export default StatusPanel;