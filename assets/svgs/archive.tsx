import React from 'react';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';
import { ISvg } from './types';

function Archive({ width = 21, height = 20 }: ISvg) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 21 20">
      <G clipPath="url(#clip0_316_827)">
        <Path
          stroke="#0A2540"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M18.167 6.667V17.5h-15V6.667M9 10h3.333M1.5 2.5h18.333v4.167H1.5V2.5z"
        ></Path>
      </G>
      <Defs>
        <ClipPath id="clip0_316_827">
          <Path fill="#fff" d="M0 0H20V20H0z" transform="translate(.666)"></Path>
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default Archive;
