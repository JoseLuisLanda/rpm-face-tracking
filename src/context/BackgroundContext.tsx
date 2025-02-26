import React, { createContext, useContext, ReactNode } from 'react';
import { useBackgroundImage } from '../hooks/useBackgroundImage';

interface BackgroundContextProps {
  children: ReactNode;
}

type BackgroundContextType = ReturnType<typeof useBackgroundImage>;

const BackgroundContext = createContext<BackgroundContextType | null>(null);

export const BackgroundProvider: React.FC<BackgroundContextProps> = ({ children }) => {
  const backgroundState = useBackgroundImage();
  
  return (
    <BackgroundContext.Provider value={backgroundState}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};