import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvg } from './types';

function IconUploadImage({ width = 18, height = 18 }: ISvg) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 18 18">
      <Path
        stroke="#0A2540"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M3.167 16.5h11.666c.92 0 1.667-.746 1.667-1.667V3.167c0-.92-.746-1.667-1.667-1.667H3.167c-.92 0-1.667.746-1.667 1.667v11.666c0 .92.746 1.667 1.667 1.667zm0 0l9.166-9.167L16.5 11.5M7.333 6.083a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"
      ></Path>
    </Svg>
  );
}

export default IconUploadImage;
