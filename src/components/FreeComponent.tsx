import React from 'react';

interface FreeComponentProps {
  config: any;
}

const FreeComponent: React.FC<FreeComponentProps> = ({ config }) => {
  return (
    <div className="nav-wrap">
      <div className="free-content">
        <div className="free-pattern"></div>
      </div>
    </div>
  );
};

export default FreeComponent;