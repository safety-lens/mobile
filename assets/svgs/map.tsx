import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvg } from './types';

function MapIcon({ width = 23, height = 23, fill = '#0A2540' }: ISvg) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 20 20">
      <Path
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6.666 15L.833 18.333V5l5.833-3.333m0 13.333l6.667 3.333M6.666 15V1.666m6.667 16.667L19.166 15V1.666L13.333 5m0 13.333V5m0 0L6.666 1.667"
      ></Path>
    </Svg>
  );
}

export default MapIcon;
