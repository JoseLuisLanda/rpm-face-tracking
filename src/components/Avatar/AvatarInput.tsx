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
    </>
  );
};

export default AvatarInput;