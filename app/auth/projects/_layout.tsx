import { useApiProject } from '@/axios/api/projects';
import { SubscriptionGuard } from '@/components/subscriptionGuard';
import { useAuth } from '@/context/AuthProvider';
import { useProjects } from '@/context/projectsProvider';
import { useSubscription } from '@/context/SubscriptionProvider';
import { Stack } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import 'react-native-reanimated';

export default function RootLayout() {
  const { user } = useAuth();
  const { hasSubscription } = useSubscription();
  const { getAllProject } = useApiProject();
  const { statusFilter } = useProjects();

  const searchProject = useCallback(async () => {
    const isUserId = user?.auth.role !== 'user' ? user?.auth.id : undefined;
    if (user) {
      await getAllProject({ userId: isUserId, status: statusFilter });
    }
  }, [getAllProject, statusFilter, user]);

  useEffect(() => {
    if (hasSubscription) {
      searchProject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSubscription]);

  return (
    <SubscriptionGuard>
      <Stack
        screenOptions={{
          headerShown: false,
          presentation: 'card',
          animation: 'fade',
          animationDuration: 100,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(id)/[id]" />
        <Stack.Screen
          name="(observations)/[observations]"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="observationMap" />
      </Stack>
    </SubscriptionGuard>
  );
}
