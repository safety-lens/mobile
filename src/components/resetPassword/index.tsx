import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useForm } from 'react-hook-form';
import TextField from '../form/textField';
import CustomButton from '../CustomButton/button';
import { useApiSignIn } from '@/axios/api/auth';
import { useTranslation } from 'react-i18next';
import useRememberMe from '@/hooks/useRememberMe';
import Toast from 'react-native-toast-message';

interface IData {
  email: string;
}
export type IDataSignIn = Omit<IData, 'checkbox'>;

export default function ResetPassword() {
  const { getForgotPassword } = useApiSignIn();
  const { getAutData } = useRememberMe();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: IData) => {
    const { email } = data;
    await getForgotPassword({ email })
      .then(() =>
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2:
            'Please, check your email inbox to proceed with Password Reset. Thank you!',
        })
      )
      .catch((error) =>
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: error.message || 'Some error reset password, try again',
        })
      );
  };

  const checkSavaData = async () => {
    await getAutData().then((e) => {
      setValue('email', e?.email);
    });
  };

  useEffect(() => {
    checkSavaData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.registerForm}>
        {/* TODO Toast if Toast not display */}
        <View>
          <Text style={{ fontWeight: 700, fontSize: 18 }}>Forgot your password?</Text>
          <Text>
            No worries. Enter the email address associated with your account and we’ll
            send you a secure reset link.
          </Text>
        </View>
        <TextField<IData>
          control={control}
          errors={errors}
          label={t('enterYourEmail')}
          name="email"
          pattern={/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i}
          required
          keyboardType="email-address"
        />
        <CustomButton padding={4} title={t('Next')} onPress={handleSubmit(onSubmit)} />
      </View>
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
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  registerForm: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 24,
    gap: 16,
  },
  forgotPassword: {
    alignItems: 'flex-end',
  },
});
