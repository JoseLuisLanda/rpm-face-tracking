import React from 'react';
import { useBackgroundImage } from '../../hooks/useBackgroundImage';
import ImageArrayControl from './ImageArrayControl';

interface BackgroundControlsProps {
  isVisible: boolean;
}

const BackgroundControls: React.FC<BackgroundControlsProps> = ({ isVisible }) => {
  const {
    imageArrays,
    handleImageArrayChange,
    handleArrayClick,
    handleBackgroundChange,
    addNewArray,
    removeLastArray
  } = useBackgroundImage();

  return (
    <>
      <div className={`collapsible-left-container ${isVisible ? 'show' : ''}`}>
        <div className="image-array-container">
          {Object.keys(imageArrays).map(key => (
            <ImageArrayControl
              key={key}
              arrayKey={key}
              onAddImages={handleImageArrayChange}
              onSetBackground={handleArrayClick}
            />
          ))}
          <button onClick={addNewArray}>Add New Array</button>
          <button onClick={removeLastArray}>Remove Last Array</button>
        </div>
      </div>
      
      <input 
        id="backgroundInput" 
        type="file" 
        accept="image/*" 
        multiple 
        style={{ display: 'none' }} 
        onChange={handleBackgroundChange} 
      />
    </>
  );
};

export default BackgroundControls;