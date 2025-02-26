import React, { useEffect, useState } from 'react';
import './App.css';
import imageback from './imageback.png';
import { Color, Euler } from 'three';
import { Canvas } from '@react-three/fiber';
import { useDropzone } from 'react-dropzone';
import Avatar from './Avatar';
import { FaceTrackingProvider, useTracking } from './context/FaceTrackingContext';
import VideoPreview from './components/FaceTracking/VideoPreview';

function AppContent() {
  const { isTracking } = useTracking();
  const [url, setUrl] = useState<string>("https://models.readyplayer.me/67be99147e1ad1bd7ca8d376.glb?morphTargets=ARKit&textureAtlas=1024");
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [backgroundImages, setBackgroundImages] = useState<string[]>([imageback]);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState<number>(0);
  const [isCollapsibleVisible, setIsCollapsibleVisible] = useState<boolean>(false);
  const [isLeftCollapsibleVisible, setIsLeftCollapsibleVisible] = useState<boolean>(false);
  const [imageArrays, setImageArrays] = useState<{ [key: string]: string[] }>({});
  const [visibleArrayButtons, setVisibleArrayButtons] = useState<{ [key: string]: boolean }>({});
  
  // Resto de la lógica no relacionada con el tracking facial
  
  // ... [se mantienen los métodos para el manejo de background, arrays de imágenes, etc.]

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

  const handleBackgroundChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newBackgroundImages: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          newBackgroundImages.push(reader.result as string);
          if (newBackgroundImages.length === files.length) {
            setBackgroundImages(newBackgroundImages);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleImageArrayChange = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setImageArrays(prev => ({ ...prev, [key]: newImages }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleArrayClick = (key: string) => {
    if (imageArrays[key]) {
      setBackgroundImages(imageArrays[key]);
      setCurrentBackgroundIndex(0);
    }
  };

  const toggleArrayButtons = (key: string) => {
    setVisibleArrayButtons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const addNewArray = () => {
    const newKey = `Array ${Object.keys(imageArrays).length + 1}`;
    setImageArrays(prev => ({ ...prev, [newKey]: [] }));
    setVisibleArrayButtons(prev => ({ ...prev, [newKey]: false }));
  };

  const removeLastArray = () => {
    const keys = Object.keys(imageArrays);
    if (keys.length > 0) {
      const lastKey = keys[keys.length - 1];
      setImageArrays(prev => {
        const newArrays = { ...prev };
        delete newArrays[lastKey];
        return newArrays;
      });
      setVisibleArrayButtons(prev => {
        const newVisible = { ...prev };
        delete newVisible[lastKey];
        return newVisible;
      });
    }
  };

  useEffect(() => {
    document.getElementById('root')!.style.backgroundImage = `url(${backgroundImages[currentBackgroundIndex]})`;
  }, [currentBackgroundIndex, backgroundImages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackgroundIndex(prevIndex => (prevIndex + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages]);

  return (
    <div className="App">
      <div className="button-container">
        <button id='btnShowDiv' onClick={() => setIsCollapsibleVisible(!isCollapsibleVisible)}>
          {isCollapsibleVisible ? 'Hide Info' : 'Show Info'}
        </button>
        <button onClick={() => document.getElementById('backgroundInput')?.click()}>Change Background</button>
        <button onClick={() => setIsLeftCollapsibleVisible(!isLeftCollapsibleVisible)}>
          {isLeftCollapsibleVisible ? 'Hide Image Controls' : 'Show Image Controls'}
        </button>
      </div>

      <div className={`collapsible-left-container ${isLeftCollapsibleVisible ? 'show' : ''}`}>
        <div className="image-array-container">
          {Object.keys(imageArrays).map(key => (
            <div key={key} className="image-array">
              <p>{key}</p>
              <input id={`file-input-${key}`} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => handleImageArrayChange(key, e)} />
              <button onClick={() => (document.getElementById(`file-input-${key}`) as HTMLInputElement)?.click()}>Add Images</button>
              <button onClick={() => handleArrayClick(key)}>Set as Background</button>
            </div>
          ))}
          <button onClick={addNewArray}>Add New Array</button>
          <button onClick={removeLastArray}>Remove Last Array</button>
        </div>
      </div>

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

      <input id="backgroundInput" type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleBackgroundChange} />

      <img className='logo' src="./logo.png" alt="Logo" />
    </div>
  );
}

function App() {
  return (
    <FaceTrackingProvider>
      <AppContent />
    </FaceTrackingProvider>
  );
}

export default App;