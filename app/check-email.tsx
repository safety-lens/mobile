import { StyleSheet, View } from 'react-native';
import React from 'react';
import ScreenLayout from '@/components/screenLayout';
import TextField from '@/components/form/textField';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import CustomButton from '@/components/CustomButton/button';
import { useApiSignIn } from '@/axios/api/auth';
import { router } from 'expo-router';
import { KeyboardAnimationTest } from '@/components/GradualAnimationText';
import { Typography } from '@/components/Typography';

interface IData {
  email: string;
}

export default function CheckEmail() {
  const { t } = useTranslation();

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

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Typography preset="header">{t('authFlow.enterEmail')}</Typography>
        <Typography size="sm" color="light">
          {t('authFlow.enterEmailDescription')}
        </Typography>
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
          autoCapitalize="none"
        />
        <CustomButton
          padding={4}
          backgroundColor={'#313131'}
          title={t('signIn')}
          onPress={handleSubmit(onSubmit)}
        />
        <KeyboardAnimationTest value={220} />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingHorizontal: 26,
    borderRadius: 16,
    gap: 16,
    flex: 1,
    justifyContent: 'center',
  },
});
