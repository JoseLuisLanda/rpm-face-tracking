import React, { useState } from 'react';
import ActionButtons from '../UI/ActionButtons';
import BackgroundControls from '../Background/BackgroundControls';
import CollapsiblePanel from '../UI/CollapsiblePanel';
import VideoPreview from '../FaceTracking/VideoPreview';
import AvatarCanvas from '../Avatar/AvatarCanvas';

const AppLayout: React.FC = () => {
  const [isInfoVisible, setIsInfoVisible] = useState<boolean>(false);
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(false);
  const [isAvatarSelectorVisible, setIsAvatarSelectorVisible] = useState<boolean>(false); // Añadir este estado

  const triggerBackgroundInput = () => {
    document.getElementById('backgroundInput')?.click();
  };

  return (
    <div className="App">
      <ActionButtons 
        onToggleInfo={() => setIsInfoVisible(!isInfoVisible)}
        onToggleControls={() => setIsControlsVisible(!isControlsVisible)}
        onChangeBackground={triggerBackgroundInput}
        onToggleAvatarSelector={() => setIsAvatarSelectorVisible(!isAvatarSelectorVisible)} // Añadir esta prop
        isInfoVisible={isInfoVisible}
        isControlsVisible={isControlsVisible}
        isAvatarSelectorVisible={isAvatarSelectorVisible} // Añadir esta prop
      />

      <BackgroundControls isVisible={isControlsVisible} />
      <CollapsiblePanel isVisible={isInfoVisible} />
      <VideoPreview />
      <AvatarCanvas />

      <img className='logo' src="./logo.png" alt="Logo" />
    </div>
  );
};

export default AppLayout;