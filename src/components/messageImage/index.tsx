import { Dimensions, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import ImageLoading from '../imageLoader';
import { Image } from 'expo-image';

interface IMessage {
  imageUrl: string | false | undefined;
}

export default function MessageImage({ imageUrl }: IMessage) {
  const windowWidth = Dimensions.get('window').width;
  const imageWidth = windowWidth - 30;
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <View style={styles.imageBox}>
      {imageUrl && (
        <>
          <ImageLoading show={imageLoading} background />
          <Image
            source={{
              uri: imageUrl,
            }}
            cachePolicy={'memory-disk'}
            style={[styles.image, { width: imageWidth }]}
            contentFit="contain"
            onDisplay={() => setImageLoading(false)}
          />
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
    borderRadius: 8,
    marginBottom: 12,
  },
});
