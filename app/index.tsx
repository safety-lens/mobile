import { StyleSheet, View } from 'react-native';
import React from 'react';
import ScreenLayout from '@/components/screenLayout';

import SLLogoFull from '../assets/svgs/SLlogoFull';
import CustomButton from '@/components/CustomButton/button';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <View style={styles.iconBox}>
          <SLLogoFull width={170} />
        </View>
        <CustomButton
          padding={4}
          backgroundColor="#313131"
          title={t('authFlow.getStarted')}
          styleAppBtn={styles.button}
          onPress={() => router.navigate('/check-email')}
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  iconBox: {
    paddingBottom: 60,
  },
  button: {
    width: '100%',
  },
});
