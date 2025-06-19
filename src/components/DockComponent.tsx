import React from 'react';

interface DockComponentProps {
  config: any;
}

const DockComponent: React.FC<DockComponentProps> = ({ config }) => {
  return (
    <div className="nav-wrap">
      <nav>
        <img src="https://assets.codepen.io/605876/finder.png" alt="Finder" />
        <img src="https://assets.codepen.io/605876/launch-control.png" alt="Launch Control" />
        <img src="https://assets.codepen.io/605876/safari.png" alt="Safari" />
        <img src="https://assets.codepen.io/605876/calendar.png" alt="Calendar" />
      </nav>
    </div>
  );
};

export default DockComponent;