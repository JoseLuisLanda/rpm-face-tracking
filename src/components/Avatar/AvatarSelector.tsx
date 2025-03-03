import React from 'react';
import './AvatarSelector.css';

export interface AvatarObject {
  url: string;
  thumbnail: string;
  name: string;
}

interface AvatarSelectorProps {
  avatars: AvatarObject[];
  currentAvatar: string;
  onSelectAvatar: (url: string) => void;
  isVisible: boolean;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  avatars,
  currentAvatar,
  onSelectAvatar,
  isVisible
}) => {
  return (
    <div className={`avatar-selector-container ${isVisible ? 'show' : ''}`}>
      <h3>Select Avatar</h3>
      <div className="avatar-list">
        {avatars.map((avatar, index) => (
          <div 
            key={index}
            className={`avatar-item ${currentAvatar === avatar.url ? 'selected' : ''}`}
            onClick={() => onSelectAvatar(`${avatar.url}?morphTargets=ARKit&textureAtlas=1024`)}
          >
            <img 
              src={avatar.thumbnail} 
              alt={avatar.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://models.readyplayer.me/67c5303fc2f17c5ef5c43794.png";
              }}
            />
            <div className="avatar-name">{avatar.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvatarSelector;



