import { View, ActivityIndicator, StyleSheet } from 'react-native';
import React from 'react';

export default function ImageLoading({
  show,
  background,
}: {
  show: boolean;
  background?: boolean;
}) {
  return show ? (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={[styles.image, background && { backgroundColor: 'rgba(2, 33, 64, 0.9)' }]}
      >
        <ActivityIndicator size="large" />
      </View>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  image: {
    justifyContent: 'center',
    borderRadius: 16,
    width: '100%',
    height: '100%',
    zIndex: 10000000,
  },
});
