import React from 'react';

interface BubbleComponentProps {
  config: any;
}

const BubbleComponent: React.FC<BubbleComponentProps> = ({ config }) => {
  return (
    <div className="nav-wrap">
      <div className="bubble-content">
        <div className="bubble-center"></div>
      </div>
    </div>
  );
};

export default BubbleComponent;