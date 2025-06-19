import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { ISvg } from './types';

interface IPinSvg extends ISvg {
  fill?: string;
}

const Pin = ({ width = 48, height = 58, fill = '#FF0D31' }: IPinSvg) => (
  <Svg width={width} height={height} fill="none">
    <G filter="url(#a)">
      <Path
        d="M34 18c0 5.523-10 20-10 20S14 23.523 14 18 18.477 8 24 8s10 4.477 10 10Z"
        fill={fill}
      />
      <Path
        d="M32.5 18c0 1.04-.503 2.728-1.436 4.852-.906 2.061-2.125 4.335-3.361 6.466A131.305 131.305 0 0 1 24 35.301l-.305-.466c-.928-1.43-2.164-3.39-3.398-5.517-1.236-2.131-2.455-4.405-3.361-6.466C16.003 20.728 15.5 19.04 15.5 18a8.5 8.5 0 0 1 17 0Z"
        stroke="#fff"
        strokeWidth={3}
      />
    </G>
  </Svg>
);

export default Pin;
