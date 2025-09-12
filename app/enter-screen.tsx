import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import ScreenLayout from '@/components/screenLayout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useKeyboardHeight from '@/hooks/useKeyboardHeight';
import { useTranslation } from 'react-i18next';
import SignInForm from '@/components/signInForm';
import { useLocalSearchParams } from 'expo-router';

export default function CheckEmail() {
  const { t } = useTranslation();
  const { keyboardStatus } = useKeyboardHeight();
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);
  const { email: emailParam } = useLocalSearchParams();

  const scrollToEnd = () => {
    scrollViewRef.current?.scrollToEnd();
  };

  useEffect(() => {
    scrollToEnd();
  }, [keyboardStatus]);

  return (
    <ScreenLayout>
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>{t('authFlow.enterEmail')}</Text>
          <Text>{t('authFlow.enterEmailDescription')}</Text>
          <SignInForm email={emailParam as string} />
        </View>
      </KeyboardAwareScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 25,
  },
});
