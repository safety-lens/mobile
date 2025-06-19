import { View, LayoutChangeEvent, StyleSheet, Dimensions } from 'react-native';
import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import ImageLoading from '../imageLoader';
import DefaultImage from '../../../assets/svgs/defaultImage';
// import { Image } from 'expo-image';
import { Image } from 'expo-image';

interface IImage {
  onImageLayout?: (e: LayoutChangeEvent) => void;
  url?: string;
  showError?: boolean;
}

export default function ImageBox({ onImageLayout, url, showError }: IImage) {
  const { t } = useTranslation();
  const [isImageLoading, setImageLoading] = useState(true);
  const [isImageLoadingError, setImageLoadingError] = useState(false);

  const windowWidth = Dimensions.get('window').width;

  const showToast = (errorText: string) => {
    if (errorText !== 'Image url is nil' && errorText !== 'Received null model') {
      setImageLoading(false);
      setImageLoadingError(true);
      if (showError) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: `Image - ${errorText || 'error'}`,
        });
      }
    }
  };

  return (
    <View
      style={{
        //TODO
        // width: isTablet() ? '100%' : windowWidth - windowWidth * 0.08,
        height: windowWidth - windowWidth * 0.2,
        backgroundColor: 'rgba(2, 33, 64, 0.9)',
        borderTopEndRadius: 12,
        borderTopStartRadius: 12,
      }}
    >
      <ImageLoading show={isImageLoading} background />
      {isImageLoadingError ? (
        <View
          style={{
            backgroundColor: '#e7e2e2',
            alignItems: 'center',
            borderTopEndRadius: 12,
            borderTopStartRadius: 12,
          }}
        >
          <DefaultImage />
        </View>
      ) : (
        <>
          {/* <Image
            source={{
              uri: url,
            }}
            key={url}
            style={styles.image}
            onLoad={() => setImageLoading(false)}
            onError={(error) => showToast(error.nativeEvent.error)}
            onLayout={onImageLayout}
          /> */}
          <Image
            source={{
              uri: url,
            }}
            key={url}
            style={styles.image}
            cachePolicy={'memory-disk'}
            contentFit="fill"
            onDisplay={() => setImageLoading(false)}
            onError={(error) => showToast(error.error)}
            onLayout={onImageLayout}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
  },
  hide: {
    zIndex: -1,
    opacity: 0,
  },
});
