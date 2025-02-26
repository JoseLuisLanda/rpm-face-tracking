import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useDropzone } from 'react-dropzone';

interface AvatarContextProps {
  children: ReactNode;
}

interface AvatarContextValue {
  url: string;
  isModelLoaded: boolean;
  setUrl: (url: string) => void;
  handleUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  dropzoneProps: ReturnType<typeof useDropzone>["getRootProps"];
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

export const AvatarProvider: React.FC<AvatarContextProps> = ({ children }) => {
  const [url, setUrl] = useState<string>("https://models.readyplayer.me/67be99147e1ad1bd7ca8d376.glb?morphTargets=ARKit&textureAtlas=1024");
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);

  const { getRootProps } = useDropzone({
    onDrop: files => {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setUrl(reader.result as string);
        setIsModelLoaded(true);
      };
      reader.readAsDataURL(file);
    }
  });

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = `${event.target.value}?morphTargets=ARKit&textureAtlas=1024`;
    setUrl(newUrl);
    setIsModelLoaded(true);
  };

  return (
    <AvatarContext.Provider value={{
      url,
      isModelLoaded,
      setUrl,
      handleUrlChange,
      dropzoneProps: getRootProps
    }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error('useAvatar must be used within an AvatarProvider');
  }
  return context;
};