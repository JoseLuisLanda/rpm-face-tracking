import React, { useState, Suspense, lazy } from 'react';
import './App.css';
import { Color } from 'three';
import { Canvas } from '@react-three/fiber';
import { useDropzone } from 'react-dropzone';
import Avatar from './Avatar';
import { FaceTrackingProvider, useTracking } from './context/FaceTrackingContext';
import { BackgroundProvider, useBackground } from './context/BackgroundContext';
import { AvatarProvider } from './context/AvatarContext';
import VideoPreview from './components/FaceTracking/VideoPreview';
import BackgroundControls from './components/Background/BackgroundControls';
import ActionButtons from './components/UI/ActionButtons';

// Lazy load components
const AppLayout = lazy(() => import('./components/Layout/AppLayout'));

function AppContent() {
  const { isTracking } = useTracking();
  const { handleBackgroundChange } = useBackground();
  
  const [url, setUrl] = useState<string>("https://models.readyplayer.me/67be99147e1ad1bd7ca8d376.glb?morphTargets=ARKit&textureAtlas=1024");
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [isCollapsibleVisible, setIsCollapsibleVisible] = useState<boolean>(false);
  const [isLeftCollapsibleVisible, setIsLeftCollapsibleVisible] = useState<boolean>(false);
  
  // Configuración del dropzone para el avatar
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
  }

  const triggerBackgroundInput = () => {
    document.getElementById('backgroundInput')?.click();
  };

  return (
    <div className="App">
      <ActionButtons 
        onToggleInfo={() => setIsCollapsibleVisible(!isCollapsibleVisible)}
        onToggleControls={() => setIsLeftCollapsibleVisible(!isLeftCollapsibleVisible)}
        onChangeBackground={triggerBackgroundInput}
        isInfoVisible={isCollapsibleVisible}
        isControlsVisible={isLeftCollapsibleVisible}
      />

      <BackgroundControls isVisible={isLeftCollapsibleVisible} />

      <div className={`collapsible-container ${isCollapsibleVisible ? 'show' : ''}`}>
        <div id="presentation">
          <p>Presentation content goes here...</p>
        </div>

        <div id="status-container" className="status-container">
          <div className={`status-indicator ${isTracking ? 'active' : ''}`}>
            {isTracking ? 'Tracking Active' : 'Initializing Tracking...'}
          </div>
          <div className={`status-indicator ${isModelLoaded ? 'active' : ''}`}>
            {isModelLoaded ? 'Model Loaded' : 'Default Model'}
          </div>
        </div>
        <div {...getRootProps({ className: 'dropzone' })}>
          <p>Drag & drop RPM avatar GLB file here</p>
        </div>
        <input className='url' type="text" placeholder="Paste RPM avatar URL" onChange={handleOnChange} />
      </div>

      <VideoPreview />

      <div className="canvas-container">
        <Canvas camera={{ fov: 25 }} shadows>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} color={new Color(1, 1, 0)} intensity={0.5} castShadow />
          <pointLight position={[-10, 0, 10]} color={new Color(1, 0, 0)} intensity={0.5} castShadow />
          <pointLight position={[0, 0, 10]} intensity={0.5} castShadow />
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
          <Suspense fallback={<div>Loading...</div>}>
            <AppLayout />
          </Suspense>
        </AvatarProvider>
      </BackgroundProvider>
    </FaceTrackingProvider>
  );
}

export default App;