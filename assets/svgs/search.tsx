import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvg } from './types';

function SearchIcon({ width = 20, height = 20, fill = '#667085' }: ISvg) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 20 20">
      <Path
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M17.5 17.5l-3.625-3.625m1.958-4.708a6.667 6.667 0 11-13.333 0 6.667 6.667 0 0113.333 0z"
      ></Path>
    </Svg>
  );
}

export default SearchIcon;
