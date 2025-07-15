import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useForm } from 'react-hook-form';
import TextField from '../form/textField';
import CustomButton from '../CustomButton/button';
import { useApiSignIn } from '@/axios/api/auth';
import { useTranslation } from 'react-i18next';
import CheckboxField from '../form/checkbox';
import useRememberMe from '@/hooks/useRememberMe';
import { Link } from 'expo-router';

interface IData {
  email: string;
  password: string;
  checkbox: boolean;
}
export type IDataSignIn = Omit<IData, 'checkbox'>;

export default function SignInForm() {
  const { signIn } = useApiSignIn();
  const { saveAutData, getAutData } = useRememberMe();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      // email: 'b.baker@vigilantsafety.co',
      // password: 'VeryStrongPassword123$',
      checkbox: false,
      // email: 'company@example.com',
    },
  });

  const onSubmit = async (data: IData) => {
    const { password, email, checkbox } = data;

    if (checkbox) {
      saveAutData({ password, email });
    }

    await signIn({
      password,
      email,
    });
  };

  const checkSavaData = async () => {
    await getAutData().then((e) => {
      setValue('email', e?.email);
      setValue('password', e?.password);
      setValue('checkbox', true);
    });
  };

  useEffect(() => {
    checkSavaData();
  }, []);

  return (
    <View style={styles.registerForm}>
      <Text style={styles.title}>{t('SignIn')}</Text>

      <TextField<IData>
        control={control}
        errors={errors}
        label={t('email')}
        name="email"
        required
        keyboardType="email-address"
      />
      <TextField<IData>
        control={control}
        errors={errors}
        secureText
        label={t('password')}
        name="password"
        required
      />
      <View style={styles.forgotPassword}>
        <Link href="/reset-password" style={{ textDecorationLine: 'underline' }}>
          <Text>{t('forgotPassword')}</Text>
        </Link>
      </View>
      <CheckboxField<IData>
        control={control}
        errors={errors}
        label={t('rememberMe')}
        name="checkbox"
        required={false}
      />

      <CustomButton
        padding={4}
        backgroundColor={'#0A2540'}
        title={t('logIn')}
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
