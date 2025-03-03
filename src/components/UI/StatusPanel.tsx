import React from 'react';
import { useTracking } from '../../context/FaceTrackingContext';
import { useAvatar } from '../../context/AvatarContext';

const StatusPanel: React.FC = () => {
  const { isTracking } = useTracking();
  const { isModelLoaded } = useAvatar();

  return (
    <div style={{ border: '1px solid white', padding: '10px', marginTop: '10px' }}>
      <p>Status Panel Content</p>
    </div>
  );
};

export default StatusPanel;