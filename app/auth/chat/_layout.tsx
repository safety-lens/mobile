import { SubscriptionGuard } from '@/components/subscriptionGuard';
import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <SubscriptionGuard>
      <Stack
        screenOptions={{
          presentation: 'card',
          animation: 'fade',
          animationDuration: 100,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="chatList" options={{ headerShown: false }} />
      </Stack>
    </SubscriptionGuard>
  );
}
