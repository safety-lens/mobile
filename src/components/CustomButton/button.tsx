import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import React from 'react';

interface IField {
  onPress?: () => void;
  title?: string;
  backgroundColor?: string;
  color?: string;
  padding?: number;
  icon?: React.JSX.Element;
  styleBtn?: StyleProp<TextStyle>;
  styleAppBtn?: StyleProp<ViewStyle>;
  outline?: boolean;
  disabled?: boolean;
}

export default function CustomButton({
  title = 'Button',
  onPress,
  backgroundColor = '#010101',
  padding,
  icon,
  styleBtn,
  styleAppBtn,
  outline,
  disabled,
}: IField) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.appButtonContainer,
        styleAppBtn,
        outline && styles.outline,
        { backgroundColor: backgroundColor },
        { opacity: !disabled ? 1 : 0.5 },
      ]}
    >
      {icon && <View>{icon}</View>}
      <Text
        style={[
          styles.appButtonText,
          styleBtn,
          outline && styles.outlineBtn,
          { padding: padding },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  appButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    elevation: 8,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    boxShadow: '0 0px 0px 0px rgba(0, 0, 0, 0.1)',
  },
  appButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    alignSelf: 'center',
  },
  outline: {
    borderColor: '#D0D5DD',
    borderWidth: 1,
    borderRadius: 8,
    flex: 1,
  },
  outlineBtn: {
    color: '#000',
  },
});
