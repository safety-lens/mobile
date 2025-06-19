import React from 'react';
import ScreenLayout from '@/components/screenLayout';
import ScreenTopNav from '@/components/screenTopNav';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusTitle } from '@/types/observation';
import PinOnMap from '@/components/pinOnMap';
import { useProjects } from '@/context/projectsProvider';
import CustomButton from '@/components/CustomButton/button';
import { useTranslation } from 'react-i18next';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function ObservationMap() {
  const { t } = useTranslation();
  const { status, observation } = useLocalSearchParams();
  const { singleProjects } = useProjects();

  const backPathOnClick = () => {
    router.back();
  };
  /* TODO 342 */
  const { x, y, name, locationComment } = JSON.parse(observation as string | '').item;

  const pinData = {
    id: (x + y) as number,
    x: x as number,
    y: y as number,
    status: status as StatusTitle,
    conversationId: { messages: [] },
    _id: '',
    name: name as string,
    projectId: '',
    photoList: [],
    implementedActions: '',
    hazardIdentified: '',
    isPublished: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    text: '',
  };

  return (
    <ScreenLayout>
      <ScreenTopNav title={`${name}`} backPathOnClick={backPathOnClick} />
      <ScrollView scrollEnabled={false} style={{ marginTop: 30 }}>
        <PinOnMap
          editable={false}
          imageMap={singleProjects?.mainPhoto}
          observations={[pinData]}
          setLocations={(e) => console.log('PinOnMap', e)}
        />
        {/* TODO 342 */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.title}>{t('comment')}:</Text>
          <Text>{locationComment}</Text>
        </View>
      </ScrollView>
      <View style={{ height: 40, marginBottom: 20 }}>
        <CustomButton
          onPress={backPathOnClick}
          backgroundColor="white"
          outline
          title={t('backObservations')}
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
});
