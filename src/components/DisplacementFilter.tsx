import React from 'react';

const DisplacementFilter: React.FC = () => {
  return (
    <svg className="filter" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="filter" colorInterpolationFilters="sRGB">
          <feImage x="0" y="0" width="100%" height="100%" result="map" href="" />
          <feDisplacementMap in="SourceGraphic" in2="map" id="redchannel" xChannelSelector="R" yChannelSelector="G" result="dispRed" />
          <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="red" />
          <feDisplacementMap in="SourceGraphic" in2="map" id="greenchannel" xChannelSelector="R" yChannelSelector="G" result="dispGreen" />
          <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="green" />
          <feDisplacementMap in="SourceGraphic" in2="map" id="bluechannel" xChannelSelector="R" yChannelSelector="G" result="dispBlue" />
          <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="blue" />
          <feBlend in="red" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blue" mode="screen" result="output" />
          <feGaussianBlur in="output" stdDeviation="0.7" />
        </filter>
      </defs>
    </svg>
  );
};

export default DisplacementFilter;