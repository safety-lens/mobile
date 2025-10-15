import React, { StyleSheet, View } from 'react-native';
import { useCallback, useState } from 'react';
import ScreenLayout from '@/components/screenLayout';
import { useTranslation } from 'react-i18next';
import CustomButton from '@/components/CustomButton/button';
import { router, useLocalSearchParams } from 'expo-router';
import { KeyboardAnimationTest } from '@/components/GradualAnimationText';
import { useApiSignIn } from '@/axios/api/auth';
import Toast from 'react-native-toast-message';
import { Typography } from '@/components/Typography';

export default function CheckEmail() {
  const { email: emailParam } = useLocalSearchParams();

  const [isShowTips, setIsShowTips] = useState(false);

  const { t } = useTranslation();

  const { sendRegistrationLink } = useApiSignIn();

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

  const goToSignIn = useCallback(() => {
    router.push({
      pathname: '/enter-screen',
      params: { email: emailParam },
    });
  }, [emailParam]);

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Typography preset="header">{t('authFlow.completeYourAccountSetup')}</Typography>
        <Typography size="sm" color="light">
          {t('authFlow.completeYourAccountSetupDescription', { email: emailParam })}
        </Typography>
        <CustomButton
          disabled={isShowTips}
          padding={4}
          backgroundColor="#313131"
          title={isShowTips ? t('authFlow.linkSent') : t('authFlow.sendLink')}
          onPress={onSubmit}
        />
        {isShowTips && (
          <>
            <Typography center size="xs" color="lighter">
              {t('authFlow.registrationLinkWillBeSentTo', { email: emailParam })}
            </Typography>
            <CustomButton
              padding={4}
              title={t('authFlow.goBack')}
              onPress={goToSignIn}
              backgroundColor="transparent"
              styleBtn={{ color: '#535862' }}
            />
          </>
        )}
      </View>
      <KeyboardAnimationTest value={240} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginHorizontal: 24,
    gap: 16,
    flex: 1,
    justifyContent: 'center',
  },
});
