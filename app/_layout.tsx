import React from 'react';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { en, registerTranslation } from 'react-native-paper-dates';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Router from './router';
import { AuthProvider } from '@/context/AuthProvider';
import NotificationProvider from '@/context/NotificationProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SubscriptionProvider } from '@/context/SubscriptionProvider';

registerTranslation('en', en);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView>
          <AuthProvider>
            <SubscriptionProvider>
              <NotificationProvider>
                <PaperProvider>
                  <Router />
                </PaperProvider>
              </NotificationProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
