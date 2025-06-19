import * as React from 'react';
import { ISvg } from './types';
import Svg, { Path } from 'react-native-svg';

const PlusIcon = ({ width = 25, height = 25 }: ISvg) => (
  <Svg width={width} height={height} viewBox="0 0 23 23">
    <Path
      fill="#FFB600"
      d="M23 11.5C23 17.851 17.851 23 11.5 23S0 17.851 0 11.5 5.149 0 11.5 0 23 5.149 23 11.5"
    ></Path>
    <Path
      fill="#022140"
      d="M12.938 5.75a1.438 1.438 0 0 0-2.876 0v4.672H5.75a1.438 1.438 0 0 0 0 2.875h4.313v3.953a1.438 1.438 0 0 0 2.874 0v-3.953h4.313a1.438 1.438 0 0 0 0-2.875h-4.312z"
    ></Path>
  </Svg>
);

export default PlusIcon;
