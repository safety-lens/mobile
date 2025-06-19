import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvg } from './types';

function LogOutIcon({ width = 20, height = 20, fill = '#fff' }: ISvg) {
  return (
    <Svg width={width} height={height} fill="transparent" viewBox="0 0 20 20">
      <Path
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12.5 2.5h3.333A1.666 1.666 0 0117.5 4.167v11.666a1.666 1.666 0 01-1.667 1.667H12.5m-5.833-3.333L2.5 10m0 0l4.167-4.167M2.5 10h10"
      ></Path>
    </Svg>
  );
}

export default LogOutIcon;
