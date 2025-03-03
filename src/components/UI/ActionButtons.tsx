import React from 'react';
import './ActionButtons.css';

interface ActionButtonsProps {
  onToggleInfo: () => void;
  onToggleControls: () => void;
  onChangeBackground: () => void;
  onToggleAvatarSelector: () => void;
  isInfoVisible: boolean;
  isControlsVisible: boolean;
  isAvatarSelectorVisible: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onToggleInfo,
  onToggleControls,
  onChangeBackground,
  onToggleAvatarSelector,
  isInfoVisible,
  isControlsVisible,
  isAvatarSelectorVisible
}) => {
  return (
    <div className="action-buttons">
      <button 
        className={`action-button ${isInfoVisible ? 'active' : ''}`} 
        onClick={onToggleInfo}
        aria-label="Toggle info panel"
      >
        ℹ️
      </button>
      <button 
        className={`action-button ${isControlsVisible ? 'active' : ''}`} 
        onClick={onToggleControls}
        aria-label="Toggle controls panel"
      >
        ⚙️
      </button>
      <button 
        className="action-button" 
        onClick={onChangeBackground}
        aria-label="Change background"
      >
        🖼️
      </button>
      <button 
        className={`action-button ${isAvatarSelectorVisible ? 'active' : ''}`} 
        onClick={onToggleAvatarSelector}
        aria-label="Select avatar"
      >
        👤
      </button>
    </div>
  );
};

export default ActionButtons;