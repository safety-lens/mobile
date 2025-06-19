import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvg } from './types';

function Repeat({ width = 20, height = 20 }: ISvg) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 20 20">
      <Path
        stroke="#0A2540"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14.167.833L17.5 4.167m0 0L14.167 7.5M17.5 4.167H5.833A3.333 3.333 0 002.5 7.5v1.667m3.333 10L2.5 15.833m0 0L5.833 12.5M2.5 15.833h11.667A3.333 3.333 0 0017.5 12.5v-1.667"
      ></Path>
    </Svg>
  );
}

export default Repeat;
