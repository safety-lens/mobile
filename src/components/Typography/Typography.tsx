import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';

const colorStyles = {
  default: { color: '#181D27' },
  light: { color: '#535862' },
  lighter: { color: '#717680' },
  primary: { color: '#022140' },
};

const sizeStyles = {
  xxl: { fontSize: 36, lineHeight: 44 } satisfies TextStyle,
  xl: { fontSize: 24, lineHeight: 34 } satisfies TextStyle,
  lg: { fontSize: 20, lineHeight: 32 } satisfies TextStyle,
  md: { fontSize: 18, lineHeight: 26 } satisfies TextStyle,
  sm: { fontSize: 16, lineHeight: 24 } satisfies TextStyle,
  xs: { fontSize: 14, lineHeight: 21 } satisfies TextStyle,
  xxs: { fontSize: 12, lineHeight: 18 } satisfies TextStyle,
};

type Sizes = keyof typeof sizeStyles;
type Colors = keyof typeof colorStyles;
type Presets = 'default' | 'header';

const presetStyles = {
  default: {},
  header: {
    ...sizeStyles.xl,
    fontWeight: '600',
  } as TextStyle,
};

interface Props extends TextProps {
  children: string;
  fullWidth?: boolean;
  size?: Sizes;
  color?: Colors;
  preset?: Presets;
  weight?: TextStyle['fontWeight'];
}

const Typography = ({
  children,
  fullWidth = true,
  color,
  size,
  weight,
  preset,
  style,
  ...rest
}: Props) => {
  return (
    <Text
      style={[
        styles.text,
        fullWidth && styles.textFull,
        weight ? { fontWeight: weight } : {},
        preset && presetStyles[preset],
        color && colorStyles[color],
        size && sizeStyles[size],
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default Typography;

const styles = StyleSheet.create({
  text: {
    color: colorStyles.default.color,
  },
  textFull: {
    width: '100%',
  },
});
