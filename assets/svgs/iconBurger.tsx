import React from 'react';
import Svg, { Path } from 'react-native-svg';

function IconBurger() {
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <Path
        stroke="#0A2540"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M3 12h18M3 6h18M3 18h18"
      ></Path>
    </Svg>
  );
}

export default IconBurger;
