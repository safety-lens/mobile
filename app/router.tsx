import React, { useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

import { useAuth } from '@/context/AuthProvider';
import i18n from '@/localization/i18n';
import { getValueStorage } from '@/utils/storage';
import { useLastVisitedProject } from '@/hooks/lastVisitedProject';

SplashScreen.preventAutoHideAsync();

export default function Router() {
  const { user } = useAuth();
  const { openLastVisitedProject } = useLastVisitedProject();

  const [loaded] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const initLang = async () => {
    const lang = await getValueStorage('language');
    i18n.changeLanguage(lang || 'en');
  };

  const authRedirect = async () => {
    if (user) {
      openLastVisitedProject();
    } else {
      return <Redirect href="/" />;
    }
  };

  const initFuncs = async () => {
    initLang();
    await authRedirect();
    await new Promise((resolve) => setTimeout(resolve, 700));
    await SplashScreen.hideAsync();
  };

  useEffect(() => {
    initFuncs();
  }, [loaded, user]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="auth" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
