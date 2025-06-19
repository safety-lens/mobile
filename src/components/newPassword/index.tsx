import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Linking, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import TextField from '../form/textField';
import CustomButton from '../CustomButton/button';
import { useApiSignIn } from '@/axios/api/auth';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import * as LinkingExpo from 'expo-linking';
import { router } from 'expo-router';

interface IData {
  password: string;
  code: string;
  email: string;
  isInvitation: boolean;
}

export type IDataSignIn = Omit<IData, 'checkbox'>;

export default function NewPassword() {
  const { getForgotPassword } = useApiSignIn();
  const { t } = useTranslation();
  let lastPress = 0;

  const {
    getValues,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: '',
      code: '',
      email: '',
      isInvitation: false,
    },
  });

  const showError = (errorText: string) => {
    Toast.show({
      type: 'error',
      text1: t('error'),
      text2: errorText,
    });
  };

  const showCode = () => {
    const data = getValues();
    alert(`code: ${data.code}, email: ${data.email},`);
  };

  const onSubmit = async (data: IData) => {
    if (!data.code || !data.email || !data.password) {
      showError(
        'Oops! The link is broken. Please try again or request a new password reset.'
      );
      return;
    }
    const res = await getForgotPassword(data);
    if (res) {
      Toast.show({
        type: 'success',
        text1: t('success'),
        text2: 'Your new password was saved successfully',
      });
      router.navigate('/');
    } else {
      showError(
        'Some error to create new password. Please try again or request a new password reset.'
      );
    }
  };

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url || (await Linking.getInitialURL());
      console.log(url);
      if (url) {
        const parsed = LinkingExpo.parse(url);
        const email = parsed.queryParams?.email;
        const code = parsed.queryParams?.code;

        setValue('email', email as string);
        setValue('code', code as string);
      }
      if (!url) {
        showError(
          'Oops! The link is broken. Please try again or request a new password reset.'
        );
      }
    };
    const subscription = Linking.addEventListener('url', handleDeepLink);
    handleDeepLink({ url: '' });
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.registerForm}>
        <View>
          <Text style={{ fontWeight: 700, fontSize: 18 }}>Create a new password</Text>
        </View>
        <TextField<IData>
          control={control}
          errors={errors}
          secureText
          label={t('password')}
          name="password"
          required
          pattern={{
            value: /^(?=.*[A-Z])(?=.*\d).{8,100}$/,
            message:
              'Password must contain at least one uppercase letter, one number, and be between 8-100 characters',
          }}
        />
        <CustomButton padding={4} title={t('Next')} onPress={handleSubmit(onSubmit)} />
      </View>
      {/* //TODO REMOVE*/}
      <TouchableOpacity
        onPressIn={() => {
          const now = new Date().getTime();
          if (now - lastPress < 300) {
            showCode();
          }
          lastPress = now;
        }}
        style={{
          width: 40,
          height: 40,
          top: 0,
          right: 0,
          position: 'absolute',
        }}
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
