import React from 'react';
import { ISvg } from './types';
import Svg, { Path } from 'react-native-svg';

function ArrowIcon({ width = 8, height = 14 }: ISvg) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 8 14">
      <Path
        stroke="#0A2540"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 1L1 7l6 6"
      ></Path>
    </Svg>
  );
}

export default ArrowIcon;
