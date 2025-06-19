import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvg } from './types';

function Trash({ width = 21, height = 20 }: ISvg) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 21 20">
      <Path
        stroke="#0A2540"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M2.834 5h1.667m0 0h13.333M4.501 5v11.667a1.667 1.667 0 001.666 1.666h8.334a1.667 1.667 0 001.666-1.666V5M7.001 5V3.333a1.667 1.667 0 011.666-1.666h3.334a1.667 1.667 0 011.666 1.666V5m-5 4.167v5m3.334-5v5"
      ></Path>
    </Svg>
  );
}

export default Trash;
