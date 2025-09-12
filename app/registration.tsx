import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import ScreenLayout from '@/components/screenLayout';
import { useTranslation } from 'react-i18next';
import CustomButton from '@/components/CustomButton/button';
import { useApiSignIn } from '@/axios/api/auth';
import { useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { KeyboardAnimationTest } from '@/components/GradualAnimationText';

export default function CheckEmail() {
  const { email: emailParam } = useLocalSearchParams();

  const [isShowTips, setIsShowTips] = useState(false);

  const { t } = useTranslation();

  const { sendRegistrationLink } = useApiSignIn();

  // const openMailApp = async () => {
  //   //message:// -- apple email
  //   //https://gmail.app.goo.gl -- google email
  //   //ms-outlook -- outlook
  //   //https://mail.google.com/mail/mu/mp/688/#tl/Inbox -- google email browser
  //   const url = 'https://gmail.app.goo.gl';
  //   const supported = await Linking.canOpenURL(url);

  //   if (supported) {
  //     await Linking.openURL(url);
  //     setIsShowTips(true);
  //   } else {
  //     Alert.alert('Mail service not installed');
  //   }
  // };

  const onSubmit = async () => {
    sendRegistrationLink(emailParam as string).then((res) => {
      if (res === 200 || res === 201) {
        setIsShowTips(true);
        return;
      }
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2:
          'Some error to send registration link. Please try again or request a new registration link.',
      });
    });
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text style={styles.title}>{t('authFlow.completeYourAccountSetup')}</Text>
        <Text>
          {t('authFlow.completeYourAccountSetupDescription', { email: emailParam })}
        </Text>

        <CustomButton
          padding={4}
          backgroundColor={'#0A2540'}
          title={isShowTips ? t('authFlow.sendedLink') : t('authFlow.sendLink')}
          onPress={onSubmit}
        />
        {isShowTips && (
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsText}>
              {t('authFlow.emailWillBeSentTo', { email: emailParam })}
            </Text>
          </View>
        )}
      </View>
      <KeyboardAnimationTest value={240} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 24,
    gap: 16,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 25,
  },
  tipsContainer: {
    alignItems: 'center',
  },
  tipsText: {
    color: '#717680',
  },
});
