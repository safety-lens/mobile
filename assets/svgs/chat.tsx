import React from 'react';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';
import { ISvg } from './types';

function ChatIcon({ width = 25, height = 25 }: ISvg) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 23 21">
      <G clipPath="url(#clip0_1592_1188)">
        <Path
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7.604 6.778h8.042M7.604 11h5.026m3.574 5.746 2.825 2.374a1 1 0 0 0 1.643-.766V5.5a4 4 0 0 0-4-4H6.577a4 4 0 0 0-4 4v6.778a4 4 0 0 0 4 4h8.34a2 2 0 0 1 1.287.468"
        ></Path>
      </G>
      <Defs>
        <ClipPath id="clip0_1592_1188">
          <Path fill="#fff" d="M.625.5h22v20h-22z"></Path>
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default ChatIcon;
