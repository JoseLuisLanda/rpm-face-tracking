import React from 'react';
import StatusPanel from './StatusPanel';
import AvatarInput from '../Avatar/AvatarInput';

interface CollapsiblePanelProps {
  isVisible: boolean;
}

const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({ isVisible }) => {
  return (
    <div className={`collapsible-container ${isVisible ? 'show' : ''}`}>
      <div id="presentation">
        <p>Presentation content goes here...</p>
      </div>
      
      <StatusPanel />
      <AvatarInput />
    </div>
  );
};

export default CollapsiblePanel;