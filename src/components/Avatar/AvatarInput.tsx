import React from 'react';
import { useAvatar } from '../../context/AvatarContext';

const AvatarInput: React.FC = () => {
  const { handleUrlChange, dropzoneProps } = useAvatar();

  return (
    <>
      <div {...dropzoneProps({ className: 'dropzone' })}>
        <p>Drag & drop RPM avatar GLB file here</p>
      </div>
      <input 
        className='url' 
        type="text" 
        placeholder="Paste RPM avatar URL" 
        onChange={handleUrlChange} 
      />
      <div style={{ border: '1px solid white', padding: '10px', marginTop: '10px' }}>
        <p>Avatar Input Content</p>
      </div>
    </>
  );
};

export default AvatarInput;