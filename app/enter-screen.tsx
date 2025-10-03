import { StyleSheet, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import ScreenLayout from '@/components/screenLayout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useKeyboardHeight from '@/hooks/useKeyboardHeight';
import { useTranslation } from 'react-i18next';
import SignInForm from '@/components/signInForm';
import { useLocalSearchParams } from 'expo-router';
import { KeyboardAnimationTest } from '@/components/GradualAnimationText';
import { Typography } from '@/components/Typography';

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
      <View style={styles.container}>
        <Typography preset="header">{t('authFlow.enterPasswordToContinue')}</Typography>
        <Typography size="sm" color="light">
          {t('authFlow.enterEmailDescription')}
        </Typography>
        <SignInForm email={emailParam as string} />
      </View>
      <KeyboardAnimationTest value={240} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
    flex: 1,
    justifyContent: 'center',
  },
});
