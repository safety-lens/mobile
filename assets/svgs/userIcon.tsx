import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvg } from './types';

export function UserIcon({ width = 25, height = 25, fill = '#fff' }: ISvg) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20.833 21.5v-2a4 4 0 0 0-4-4h-8a4 4 0 0 0-4 4v2m12-14a4 4 0 1 1-8 0 4 4 0 0 1 8 0"
      ></Path>
    </Svg>
  );
}
