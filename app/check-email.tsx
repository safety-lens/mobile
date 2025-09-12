import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import ScreenLayout from '@/components/screenLayout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useKeyboardHeight from '@/hooks/useKeyboardHeight';
import TextField from '@/components/form/textField';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import CustomButton from '@/components/CustomButton/button';
import { useApiSignIn } from '@/axios/api/auth';
import { router } from 'expo-router';

interface IData {
  email: string;
}

export default function CheckEmail() {
  const { t } = useTranslation();
  const { keyboardStatus } = useKeyboardHeight();
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);

  const { checkEmail } = useApiSignIn();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: IData) => {
    const { email } = data;
    await checkEmail(email).then((e: { available: boolean } | undefined) => {
      if (e?.available) {
        router.push({
          pathname: '/enter-screen',
          params: { email: email },
        });
      } else {
        router.push({
          pathname: '/registration',
          params: { email: email },
        });
      }
    });
  };

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
          <TextField
            hideRequiredSymbol
            control={control}
            errors={errors}
            label={t('email')}
            pattern={/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i}
            name="email"
            required
            placeholder={t('enterYourEmail')}
            keyboardType="email-address"
          />
          <CustomButton
            padding={4}
            backgroundColor={'#0A2540'}
            title={t('logIn')}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </KeyboardAwareScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 25,
  },
});
