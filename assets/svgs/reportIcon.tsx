import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvg } from './types';

function ReportIcon({ width = 24, height = 24, fill = '#fff' }: ISvg) {
  return (
    <Svg width={width} height={height} fill={fill} viewBox="0 0 24 24">
      <Path d="M17 0h-6C8.243 0 6 2.243 6 5v10c0 2.757 2.243 5 5 5h6c2.757 0 5-2.243 5-5V5c0-2.757-2.243-5-5-5m3 15c0 1.654-1.346 3-3 3h-6c-1.654 0-3-1.346-3-3V5c0-1.654 1.346-3 3-3h6c1.654 0 3 1.346 3 3zm-3 8a1 1 0 0 1-1 1H7c-2.757 0-5-2.243-5-5V7a1 1 0 1 1 2 0v12c0 1.654 1.346 3 3 3h9a1 1 0 0 1 1 1m-5-9v1a1 1 0 1 1-2 0v-1a1 1 0 1 1 2 0m6-1v2a1 1 0 1 1-2 0v-2a1 1 0 1 1 2 0m-3-1v3a1 1 0 1 1-2 0v-3a1 1 0 1 1 2 0m3-7v2.303c0 .62-.75.931-1.188.492l-.596-.596-1.509 1.509a.997.997 0 0 1-1.414 0l-.793-.793-.793.793a.999.999 0 1 1-1.414-1.414l1.5-1.5a1 1 0 0 1 1.414 0l.793.793.802-.802-.596-.596a.696.696 0 0 1 .492-1.188h2.303a1 1 0 0 1 1 1z"></Path>
    </Svg>
  );
}

export default ReportIcon;
