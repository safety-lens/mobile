import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvg } from './types';

function EyeObservation({ width = 20, height = 20 }: ISvg) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 20 20">
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M3.333 10.833s2.424-5 6.667-5c4.242 0 6.666 5 6.666 5s-2.424 5-6.666 5c-4.243 0-6.667-5-6.667-5z"
      ></Path>
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10 12.708c1.004 0 1.818-.84 1.818-1.875 0-1.035-.814-1.875-1.818-1.875s-1.819.84-1.819 1.875c0 1.036.815 1.875 1.819 1.875zM16.25 1.667v4.166m2.084-2.083h-4.167"
      ></Path>
    </Svg>
  );
}

export default EyeObservation;
