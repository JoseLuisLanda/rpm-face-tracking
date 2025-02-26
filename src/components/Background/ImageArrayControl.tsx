import React from 'react';

interface ImageArrayControlProps {
  arrayKey: string;
  onAddImages: (key: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onSetBackground: (key: string) => void;
}

const ImageArrayControl: React.FC<ImageArrayControlProps> = ({
  arrayKey,
  onAddImages,
  onSetBackground
}) => {
  return (
    <div className="image-array">
      <p>{arrayKey}</p>
      <input 
        id={`file-input-${arrayKey}`} 
        type="file" 
        accept="image/*" 
        multiple 
        style={{ display: 'none' }} 
        onChange={(e) => onAddImages(arrayKey, e)} 
      />
      <button onClick={() => (document.getElementById(`file-input-${arrayKey}`) as HTMLInputElement)?.click()}>
        Add Images
      </button>
      <button onClick={() => onSetBackground(arrayKey)}>
        Set as Background
      </button>
    </div>
  );
};

export default ImageArrayControl;