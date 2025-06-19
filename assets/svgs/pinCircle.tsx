import React from 'react';
import Svg, { Circle, G, Text } from 'react-native-svg';
import { ISvg } from './types';

interface IPinSvg extends ISvg {
  fill?: string;
  count?: number | undefined;
}

function CirclePin({
  width = 48,
  height = 58,
  count = undefined,
  fill = '#FFBF00',
}: IPinSvg) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 48 48">
      <G filter="url(#filter0_dd_88_7804)">
        <Circle cx="24" cy="18" r="10" fill={fill}></Circle>
        <Text
          x="24"
          y="19"
          fill="#ECEDEE"
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {count}
        </Text>
        <Circle cx="24" cy="18" r="8.5" stroke="#fff" strokeWidth="3"></Circle>
      </G>
    </Svg>
  );
}

export default CirclePin;
