import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvg } from './types';

const MapLocation: React.FC<React.SVGProps<SVGElement>> = ({
  width = 22,
  height = 18,
  fill = '#0A2540',
}: ISvg) => (
  <Svg width={width} height={height} fill="none" viewBox="0 0 22 18">
    <Path
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M6.727 13.8 1 17V4.2L6.727 1m0 12.8 6.546 3.2v-1.5m-6.546-1.7V1m6.546 3.2L19 1v4m-5.727-.8L6.727 1m6.546 3.2v.3M21 9.318C21 13.455 15.5 17 15.5 17S10 13.454 10 9.318c0-1.41.58-2.763 1.61-3.76A5.6 5.6 0 0 1 15.5 4c1.459 0 2.858.56 3.89 1.558A5.23 5.23 0 0 1 21 9.318m-3.667 0c0 .98-.82 1.773-1.833 1.773s-1.833-.794-1.833-1.773.82-1.773 1.833-1.773 1.833.794 1.833 1.773"
    ></Path>
  </Svg>
);

export default MapLocation;
