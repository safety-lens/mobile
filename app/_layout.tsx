import React from 'react';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { en, registerTranslation } from 'react-native-paper-dates';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Router from './router';
import { AuthProvider } from '@/context/AuthProvider';
import NotificationProvider from '@/context/NotificationProvider';
// import { KeyboardProvider } from 'react-native-keyboard-controller';

registerTranslation('en', en);

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <GestureHandlerRootView>
        {/* <KeyboardProvider> */}
        <AuthProvider>
          <NotificationProvider>
            <PaperProvider>
              <Router />
            </PaperProvider>
          </NotificationProvider>
        </AuthProvider>
        {/* </KeyboardProvider> */}
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
