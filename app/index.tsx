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
          <SLLogoFull width={200} height={200} />
        </View>
        <CustomButton
          padding={4}
          backgroundColor={'#0A2540'}
          title={t('authFlow.getStarted')}
          styleAppBtn={{ width: '80%' }}
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
  },
  iconBox: {
    width: 'auto',
    marginLeft: 50,
  },
});
