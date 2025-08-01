import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: 'card',
        animation: 'fade',
        animationDuration: 100,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="observationList" options={{ headerShown: false }} />
    </Stack>
  );
}
