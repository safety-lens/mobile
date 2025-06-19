import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvg } from './types';

function Notification({ width = 20, height = 20, fill = '#022140' }: ISvg) {
  return (
    <Svg width={width} height={height} fill="" viewBox="0 0 20 20">
      <Path
        fill={fill}
        fillRule="evenodd"
        d="M9 .25A1.25 1.25 0 0 0 7.75 1.5v.125a6.25 6.25 0 0 0-5 6.125v5l-1.506 1.66c-.73.804-.16 2.09.925 2.09h4.666a2.5 2.5 0 0 0 4.33 0h4.666c1.084 0 1.654-1.287.925-2.09l-1.506-1.66v-5a6.25 6.25 0 0 0-5-6.125V1.5A1.25 1.25 0 0 0 9 .25M4.625 13.475l-.488.535-.557.615h10.84l-.559-.615-.486-.536V7.75a4.374 4.374 0 1 0-8.75 0z"
        clipRule="evenodd"
      ></Path>
    </Svg>
  );
}

export default Notification;
