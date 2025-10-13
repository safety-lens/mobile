import React, { useCallback, useEffect } from 'react';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

import { useAuth } from '@/context/AuthProvider';
import i18n from '@/localization/i18n';
import { getValueStorage } from '@/utils/storage';
import { useLastVisitedProject } from '@/hooks/lastVisitedProject';

SplashScreen.preventAutoHideAsync();

export default function Router() {
  const { isUserLoading, user } = useAuth();
  const { openLastVisitedProject } = useLastVisitedProject();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const initLang = useCallback(async () => {
    const lang = await getValueStorage('language');
    i18n.changeLanguage(lang || 'en');
  }, []);

  const initApp = useCallback(async () => {
    await initLang();

    if (user) {
      await openLastVisitedProject();
    } else {
      router.replace('/');
    }
    await new Promise((resolve) => setTimeout(resolve, 700));
    await SplashScreen.hideAsync();
  }, [initLang, openLastVisitedProject, user]);

  useEffect(() => {
    if (loaded && !isUserLoading) {
      initApp();
    }
  }, [loaded, initApp, isUserLoading]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        presentation: 'card',
        animation: 'fade',
        animationDuration: 100,
      }}
    >
      <Stack.Screen name="auth" />
      <Stack.Screen name="check-email" />
      <Stack.Screen name="enter-screen" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
