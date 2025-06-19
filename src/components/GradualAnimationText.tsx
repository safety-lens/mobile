import React, { useEffect, useRef } from 'react';
import { Platform, Animated, Keyboard } from 'react-native';
import useKeyboardHeight from '../hooks/useKeyboardHeight';

export const KeyboardAnimationTest = ({ value }: { value: number }) => {
  const { keyboardStatus } = useKeyboardHeight();
  const animatedHeight = useRef(new Animated.Value(0)).current;

  Animated.timing(animatedHeight, {
    toValue: keyboardStatus === 'shown' ? value : 0,
    duration: 200,
    useNativeDriver: false,
  }).start();

  useEffect(() => {
    if (keyboardStatus !== 'shown') {
      Keyboard.dismiss();
    }
  }, [keyboardStatus]);

  return (
    <Animated.View
      style={{
        height: Platform.OS === 'ios' ? animatedHeight : 0,
      }}
    />
  );
};
