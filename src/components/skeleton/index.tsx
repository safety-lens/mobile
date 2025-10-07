import { View, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

export default function Skeleton({
  isLoading,
  isLogoAnimation,
}: {
  isLoading: boolean;
  isLogoAnimation?: boolean;
}) {
  return isLoading ? (
    <View style={styles.skeleton}>
      {isLogoAnimation ? (
        <LottieView
           
          source={require('../../../assets/animation/logo-loading.json')}
          style={{ width: '100%', height: 150 }}
          autoPlay
          loop
        />
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  skeleton: {
    left: -20,
    top: -80,
    backgroundColor: 'rgba(39, 65, 92, 0.6)',
    width: '110%',
    height: '120%',
    zIndex: 1111,
    position: 'absolute',

    justifyContent: 'center',
    alignItems: 'center',
  },
});
