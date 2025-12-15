import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import React, { useCallback } from 'react';
import { ActivityIndicator } from 'react-native-paper';

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
  loading?: boolean;
}

export default function CustomButton({
  title = 'Button',
  onPress,
  color = '#fff',
  backgroundColor = '#010101',
  padding,
  icon,
  styleBtn,
  styleAppBtn,
  outline,
  loading,
  disabled,
}: IField) {
  const renderLeftIcon = useCallback(() => {
    if (icon) {
      return <View>{icon}</View>;
    }
    if (loading) {
      return <ActivityIndicator size={16} color={color} />;
    }
    return null;
  }, [icon, loading, color]);
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
      {renderLeftIcon()}
      <Text
        numberOfLines={1}
        style={[
          styles.appButtonText,
          { color, padding: padding, maxWidth: '80%' },
          styleBtn,
          outline && styles.outlineBtn,
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
