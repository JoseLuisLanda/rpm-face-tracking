import { useState, useEffect } from 'react';
import imageback from '../imageback.png';

export const useBackgroundImage = () => {
  const [backgroundImages, setBackgroundImages] = useState<string[]>([imageback]);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState<number>(0);
  const [imageArrays, setImageArrays] = useState<{ [key: string]: string[] }>({});
  const [visibleArrayButtons, setVisibleArrayButtons] = useState<{ [key: string]: boolean }>({});

  // Cambiar imagen de fondo
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

  // Manejar cambio en arrays de imágenes
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

  // Establecer un array como fondo
  const handleArrayClick = (key: string) => {
    if (imageArrays[key]) {
      setBackgroundImages(imageArrays[key]);
      setCurrentBackgroundIndex(0);
    }
  };

  // Alternar visibilidad de botones
  const toggleArrayButtons = (key: string) => {
    setVisibleArrayButtons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Añadir nuevo array
  const addNewArray = () => {
    const newKey = `Array ${Object.keys(imageArrays).length + 1}`;
    setImageArrays(prev => ({ ...prev, [newKey]: [] }));
    setVisibleArrayButtons(prev => ({ ...prev, [newKey]: false }));
  };

  // Eliminar último array
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

  // Actualizar imagen de fondo
  useEffect(() => {
    document.getElementById('root')!.style.backgroundImage = `url(${backgroundImages[currentBackgroundIndex]})`;
  }, [currentBackgroundIndex, backgroundImages]);

  // Rotación automática de imágenes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackgroundIndex(prevIndex => (prevIndex + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages]);

  return {
    backgroundImages,
    currentBackgroundIndex,
    imageArrays,
    visibleArrayButtons,
    handleBackgroundChange,
    handleImageArrayChange,
    handleArrayClick,
    toggleArrayButtons,
    addNewArray,
    removeLastArray
  };
};