import React from 'react';
import { ISvg } from './types';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';

function PlusCircle({ width = 20, height = 20 }: ISvg) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 20 20">
      <G clipPath="url(#clip0_316_444)">
        <Path
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M10 6.667v6.666M6.667 10h6.666m5 0a8.333 8.333 0 11-16.666 0 8.333 8.333 0 0116.666 0z"
        ></Path>
      </G>
      <Defs>
        <ClipPath id="clip0_316_444">
          <Path fill="#fff" d="M0 0H20V20H0z"></Path>
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default PlusCircle;
