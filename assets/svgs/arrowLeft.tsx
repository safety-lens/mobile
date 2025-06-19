import React from 'react';
import { ISvg } from './types';
import Svg, { Path } from 'react-native-svg';

function ArrowLeftIcon({ width = 14, height = 14, fill = '#0A2540' }: ISvg) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 14 14">
      <Path
        fill={fill}
        fillRule="evenodd"
        d="M7.53.636a.75.75 0 010 1.061L2.977 6.25h9.856a.75.75 0 010 1.5H2.977l4.553 4.553a.75.75 0 11-1.06 1.06L.636 7.53a.75.75 0 010-1.06L6.47.636a.75.75 0 011.06 0z"
        clipRule="evenodd"
      ></Path>
    </Svg>
  );
}

export default ArrowLeftIcon;
