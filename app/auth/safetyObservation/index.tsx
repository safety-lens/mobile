import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import ScreenLayout from '@/components/screenLayout';
import NewObservation from '@/components/observationNew';
import ScreenTopNav from '@/components/screenTopNav';
import ObservationHistory from '../../../assets/svgs/observationHistory';
import { router } from 'expo-router';
import Chat from '@/components/chat/chat';
import Skeleton from '@/components/skeleton';
import { useTranslation } from 'react-i18next';
import useAnalyzerImage from '@/hooks/analyzerImage';
import { Typography } from '@/components/Typography';

export default function SafetyObservation() {
  const { t } = useTranslation();
  const { startAnalyzerImage, startChatResponse, clearMessages, isLoading } =
    useAnalyzerImage();

  const goToObservations = () => {
    router.navigate('/auth/safetyObservation/observationList');
  };

  const backPathOnClick = () => {
    // goToObservations();
    if (startChatResponse?.messages) {
      clearMessages();
    } else {
      router.navigate('/auth/projects');
    }
  };

  return (
    <ScreenLayout>
      <Skeleton isLoading={isLoading} isLogoAnimation />
      <ScreenTopNav
        icon={
          <TouchableOpacity onPress={goToObservations}>
            <ObservationHistory />
          </TouchableOpacity>
        }
        title={t('observations')}
        backPath={
          startChatResponse?.messages ? '/auth/safetyObservation' : '/auth/projects'
        }
        backPathOnClick={backPathOnClick}
      />
      <View style={styles.mainBox}>
        {startChatResponse?.messages ? (
          <Chat
            startChatResponse={startChatResponse}
            clearMessages={() => clearMessages()}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>{t('noObservationsYet')}</Text>
              <NewObservation onChange={startAnalyzerImage} />
            </View>
            <Typography center color="lighter" size="xxs" fullWidth={false}>
              {t('resultDisclaimer')}
            </Typography>
          </View>
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  mainBox: {
    marginTop: 20,
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  placeholderText: {
    fontSize: 16,
    lineHeight: 25,
    color: '#6D7176',
    textAlign: 'center',
  },
});
