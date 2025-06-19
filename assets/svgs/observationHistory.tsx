import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvg } from './types';

function ObservationHistory({ width = 24, height = 24, fill = '#0A2540' }: ISvg) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 2H4a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2v-1M12 2l6 6m-6-6v6h6m0 0v3m-9 2H6m4 4H6m2-8H6"
      ></Path>
      <Path
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 15s2-4 5.5-4 5.5 4 5.5 4-2 4-5.5 4-5.5-4-5.5-4z"
      ></Path>
      <Path
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M17.5 16.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
      ></Path>
    </Svg>
  );
}

export default ObservationHistory;
