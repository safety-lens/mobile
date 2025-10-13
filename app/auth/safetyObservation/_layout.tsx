import { useApiSignIn } from '@/axios/api/auth';
import { SubscriptionGuard } from '@/components/subscriptionGuard';
import { useSubscription } from '@/context/SubscriptionProvider';
import { Stack, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import 'react-native-reanimated';

export default function RootLayout() {
  const { getAccounts } = useApiSignIn();

  const { hasSubscription } = useSubscription();

  useFocusEffect(
    useCallback(() => {
      if (!hasSubscription) {
        getAccounts();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasSubscription])
  );

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
        <Stack.Screen name="observationList" options={{ headerShown: false }} />
      </Stack>
    </SubscriptionGuard>
  );
}
