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
          <View style={styles.noObservationsBox}>
            <Text style={styles.textNoObservation}>{t('noObservationsYet')}</Text>
            <NewObservation onChange={startAnalyzerImage} />
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
  noObservationsBox: {
    marginTop: '70%',
    alignItems: 'center',
    paddingHorizontal: 30,
    gap: 20,
  },
  textNoObservation: {
    fontSize: 16,
    lineHeight: 25,
    color: '#6D7176',
    textAlign: 'center',
  },
});
