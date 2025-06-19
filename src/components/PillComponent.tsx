import React from 'react';

interface PillComponentProps {
  config: any;
}

const PillComponent: React.FC<PillComponentProps> = ({ config }) => {
  return (
    <div className="nav-wrap">
      <div className="pill-content">
        <div className="pill-indicator"></div>
      </div>
    </div>
  );
};

export default PillComponent;