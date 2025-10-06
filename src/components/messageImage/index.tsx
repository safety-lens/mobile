import { StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import ImageLoading from '../imageLoader';
import { Image } from 'expo-image';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { screenWidth } from '@/utils/dimensions';

interface IMessage {
  width?: number;
  imageUrl: string | false | undefined;
}

const ANIMATION_DURATION = 150;

export default function MessageImage({ width = screenWidth, imageUrl }: IMessage) {
  const imageOpacity = useSharedValue(0);

  const resetForRecycling = useCallback(() => {
    imageOpacity.value = 0;
  }, [imageOpacity]);

  useEffect(() => {
    return resetForRecycling;
  }, [resetForRecycling, imageUrl]);

  const onImageLoad = useCallback(() => {
    imageOpacity.value = withTiming(1, { duration: ANIMATION_DURATION });
  }, [imageOpacity]);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: imageOpacity.value,
    };
  });

  const loaderAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(imageOpacity.value, [0, 0.2], [1, 0]),
    };
  });

  return (
    <View style={styles.imageBox}>
      {!!imageUrl && (
        <>
          <Animated.View style={imageAnimatedStyle}>
            <Image
              source={{
                uri: imageUrl,
              }}
              cachePolicy={'memory-disk'}
              style={[styles.image, { width }]}
              contentFit="contain"
              onDisplay={onImageLoad}
            />
          </Animated.View>
          <Animated.View style={[styles.loader, loaderAnimatedStyle]}>
            <ImageLoading show background />
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageBox: {
    alignItems: 'center',
  },
  image: {
    height: 250,
    marginBottom: 12,
  },
  loader: {
    position: 'absolute',
    width: '100%',
    height: 250,
  },
});
