import React from 'react';

interface ActionButtonsProps {
  onToggleInfo: () => void;
  onToggleControls: () => void;
  onChangeBackground: () => void;
  isInfoVisible: boolean;
  isControlsVisible: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onToggleInfo,
  onToggleControls,
  onChangeBackground,
  isInfoVisible,
  isControlsVisible
}) => {
  return (
    <div className="button-container">
      <button id='btnShowDiv' onClick={onToggleInfo}>
        {isInfoVisible ? 'Hide Info' : 'Show Info'}
      </button>
      <button onClick={onChangeBackground}>Change Background</button>
      <button onClick={onToggleControls}>
        {isControlsVisible ? 'Hide Image Controls' : 'Show Image Controls'}
      </button>
    </div>
  );
};

export default ActionButtons;