import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import TextField from '../form/textField';
import CustomButton from '../CustomButton/button';
import { useApiSignIn } from '@/axios/api/auth';
import { useTranslation } from 'react-i18next';

interface IData {
  email: string;
  password: string;
}
export type IDataSignIn = Omit<IData, 'checkbox'>;

export default function SignInForm({ email }: { email: string }) {
  const { signIn } = useApiSignIn();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: email,
      password: '',
    },
  });

  const onSubmit = async (data: IData) => {
    await signIn(data);
  };
  return (
    <View style={styles.registerForm}>
      <TextField<IData>
        hideRequiredSymbol
        control={control}
        errors={errors}
        label={t('email')}
        placeholder={t('enterYourEmail')}
        pattern={/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i}
        name="email"
        required
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextField<IData>
        hideRequiredSymbol
        control={control}
        errors={errors}
        secureText
        label={t('password')}
        placeholder={t('enterYourPassword')}
        name="password"
        autoCapitalize="none"
        required
      />

      <CustomButton
        padding={4}
        backgroundColor="#313131"
        title={t('signIn')}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 25,
    textAlign: 'center',
  },
  registerForm: {
    // backgroundColor: '#FFFFFF',
    // padding: 24,
    // borderRadius: 16,
    // marginHorizontal: 24,
    gap: 16,
  },
  forgotPassword: {
    alignItems: 'flex-end',
  },
});
