import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvg } from './types';

function DownloadIcon({ width = 23, height = 23, fill = '#fff' }: ISvg) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 20 20">
      <Path
        fill={fill}
        d="M8.804 11.307a.178.178 0 0 0 .28 0l2.486-3.145a.177.177 0 0 0-.14-.287H9.785V.365a.18.18 0 0 0-.177-.178H8.276a.18.18 0 0 0-.178.177v7.509h-1.64c-.149 0-.23.17-.14.286zm8.264-.777h-1.332a.18.18 0 0 0-.178.178v3.418H2.33v-3.418a.18.18 0 0 0-.177-.178H.82a.18.18 0 0 0-.177.178v4.394c0 .393.317.71.71.71h15.182a.71.71 0 0 0 .71-.71v-4.395a.18.18 0 0 0-.177-.177"
      ></Path>
    </Svg>
  );
}

export default DownloadIcon;
