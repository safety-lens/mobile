import { useApiProject } from '@/axios/api/projects';
import { useAuth } from '@/context/AuthProvider';
import { useProjects } from '@/context/projectsProvider';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

export default function RootLayout() {
  const { user } = useAuth();
  const { getAllProject } = useApiProject();
  const { statusFilter } = useProjects();

  const searchProject = async () => {
    const isUserId = user?.auth.role !== 'user' ? user?.auth.id : undefined;
    if (user) await getAllProject({ userId: isUserId, status: statusFilter });
  };

  useEffect(() => {
    searchProject();
  }, []);

  return (
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
  );
}
