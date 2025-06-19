import { StyleSheet, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import ScreenLayout from '@/components/screenLayout';
import SignInForm from '@/components/signInForm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useKeyboardHeight from '@/hooks/useKeyboardHeight';
import SLLogo from '../assets/svgs/SLlogo';

export default function HomeScreen() {
  const { keyboardStatus } = useKeyboardHeight();
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);
  const scrollToEnd = () => {
    scrollViewRef.current?.scrollToEnd();
  };

  useEffect(() => {
    scrollToEnd();
  }, [keyboardStatus]);

  return (
    <ScreenLayout>
      <KeyboardAwareScrollView ref={scrollViewRef}>
        <View style={styles.iconBox}>
          <SLLogo width={100} height={100} />
        </View>
        <SignInForm />
      </KeyboardAwareScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
});
