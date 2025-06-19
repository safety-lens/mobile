import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvg } from './types';

function IconClose({ width = 24, height = 24, fill = '#1E1E1E' }: ISvg) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M18 6L6 18M6 6l12 12"
      ></Path>
    </Svg>
  );
}

export default IconClose;
