import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvg } from './types';

function ClipIcon({ width = 12, height = 23 }: ISvg) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 12 23">
      <Path
        fill="#0A2540"
        d="M5.812 21.517A5.82 5.82 0 0 1 0 15.705V6.172a.775.775 0 1 1 1.55 0v9.533a4.262 4.262 0 1 0 8.524 0V5.452a2.584 2.584 0 0 0-5.166 0v10.253a.905.905 0 0 0 1.808 0V6.172a.775.775 0 0 1 1.55 0v9.533a2.454 2.454 0 1 1-4.908 0V5.452a4.133 4.133 0 0 1 8.266 0v10.253a5.82 5.82 0 0 1-5.812 5.812"
      ></Path>
    </Svg>
  );
}

export default ClipIcon;
