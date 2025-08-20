import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvg } from './types';

function Edit({ width = 20, height = 20, fill = '#0A2540' }: ISvg) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 20 20">
      <Path
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14.166 2.5a2.357 2.357 0 013.333 3.333L6.25 17.083l-4.583 1.25 1.25-4.583L14.166 2.5z"
      ></Path>
    </Svg>
  );
}

export default Edit;
