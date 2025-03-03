import React, { useState } from 'react';
import './App.css';
import { Canvas } from '@react-three/fiber';
import { useDropzone } from 'react-dropzone';
import ActionButtons from './components/UI/ActionButtons';
import BackgroundControls from './components/Background/BackgroundControls';
import AvatarSelector, { AvatarObject } from './components/Avatar/AvatarSelector';
import VideoPreview from './components/FaceTracking/VideoPreview';
import Avatar from './Avatar'; // Tu componente de avatar
import { FaceTrackingProvider } from './context/FaceTrackingContext';
import { BackgroundProvider } from './context/BackgroundContext';
import { AvatarProvider } from './context/AvatarContext';
import CollapsiblePanel from './components/UI/CollapsiblePanel';

function AppContent() {
  // Lista de avatares disponibles (puedes usar rutas absolutas para las miniaturas)
  const availableAvatars: AvatarObject[] = [
    { 
      url: "https://models.readyplayer.me/67be99147e1ad1bd7ca8d376.glb", 
      thumbnail: "https://models.readyplayer.me/67be99147e1ad1bd7ca8d376.png", 
      name: "JLJL" 
    },
    { 
      url: "https://models.readyplayer.me/67c5303fc2f17c5ef5c43794.glb", 
      thumbnail: "https://models.readyplayer.me/67c5303fc2f17c5ef5c43794.png", 
      name: "ELLA" 
    }
  ];

  // Estado para URL del avatar, visibilidad de paneles, etc.
  const [url, setUrl] = useState<string>(`${availableAvatars[0].url}?morphTargets=ARKit&textureAtlas=1024`);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [isCollapsibleVisible, setIsCollapsibleVisible] = useState<boolean>(false);
  const [isLeftCollapsibleVisible, setIsLeftCollapsibleVisible] = useState<boolean>(false);
  const [isAvatarSelectorVisible, setIsAvatarSelectorVisible] = useState<boolean>(false);

  const { getRootProps } = useDropzone({
    onDrop: files => {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setUrl(reader.result as string);
        setIsModelLoaded(true);
      }
      reader.readAsDataURL(file);
    }
  });

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = `${event.target.value}?morphTargets=ARKit&textureAtlas=1024`;
    setUrl(newUrl);
    setIsModelLoaded(true);
  };

  const handleSelectAvatar = (newUrl: string) => {
    newUrl = `${newUrl}?morphTargets=ARKit&textureAtlas=1024`;
    setUrl(newUrl);
    setIsModelLoaded(true);
  };

  const triggerBackgroundInput = () => {
    document.getElementById('backgroundInput')?.click();
  };

  return (
    <div className="App">
      <ActionButtons 
        onToggleInfo={() => setIsCollapsibleVisible(!isCollapsibleVisible)}
        onToggleControls={() => setIsLeftCollapsibleVisible(!isLeftCollapsibleVisible)}
        onChangeBackground={triggerBackgroundInput}
        onToggleAvatarSelector={() => {
          console.log("Toggle avatar selector, current state:", isAvatarSelectorVisible);
          setIsAvatarSelectorVisible(!isAvatarSelectorVisible);
        }}
        isInfoVisible={isCollapsibleVisible}
        isControlsVisible={isLeftCollapsibleVisible}
        isAvatarSelectorVisible={isAvatarSelectorVisible}
      />

      <BackgroundControls isVisible={isLeftCollapsibleVisible} />

      <CollapsiblePanel isVisible={isCollapsibleVisible} />

      <AvatarSelector 
        avatars={availableAvatars}
        currentAvatar={url.split('?')[0]}
        onSelectAvatar={handleSelectAvatar}
        isVisible={isAvatarSelectorVisible}
      />

      <VideoPreview />

      <div className={`canvas-container ${isCollapsibleVisible ? 'shifted' : ''}`}>
        <Canvas camera={{ fov: 25 }} shadows>
          <ambientLight intensity={0.5} />
          {/* Luces y demás */}
          <Avatar url={url} />
        </Canvas>
      </div>

      <img className='logo' src="./logo.png" alt="Logo" />
    </div>
  );
}

function App() {
  return (
    <FaceTrackingProvider>
      <BackgroundProvider>
        <AvatarProvider>
          <AppContent />
        </AvatarProvider>
      </BackgroundProvider>
    </FaceTrackingProvider>
  );
}

export default App;