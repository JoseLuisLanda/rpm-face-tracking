import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Color } from 'three';
import Avatar from '../../Avatar';
import { useAvatar } from '../../context/AvatarContext';

const AvatarCanvas: React.FC = () => {
  const { url } = useAvatar();
  
  return (
    <div className="canvas-container">
      <Canvas camera={{ fov: 25 }} shadows>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color={new Color(1, 1, 0)} intensity={0.5} castShadow />
        <pointLight position={[-10, 0, 10]} color={new Color(1, 0, 0)} intensity={0.5} castShadow />
        <pointLight position={[0, 0, 10]} intensity={0.5} castShadow />
        <Avatar url={url} />
      </Canvas>
    </div>
  );
};

export default AvatarCanvas;