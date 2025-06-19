import React from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

export default function GradualAnimationTwo() {
  const PADDING_BOTTOM = 0;

  const useGradualAnimation = () => {
    const height = useSharedValue(PADDING_BOTTOM);

    useKeyboardHandler(
      {
        onMove: (event) => {
          'worklet';
          height.value = Math.max(event.height, PADDING_BOTTOM);
        },
      },
      []
    );
    return { height };
  };

  const { height } = useGradualAnimation();

  const fakeView = useAnimatedStyle(() => {
    return {
      height: Math.abs(height.value),
      marginBottom: height.value > 90 ? -90 : 0,
    };
  }, []);

  return <Animated.View style={fakeView} />;
}
