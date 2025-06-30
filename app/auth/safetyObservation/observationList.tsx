import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import ScreenLayout from '@/components/screenLayout';
import MyObservationCard from '@/components/myObservationCard';
import ScreenTopNav from '@/components/screenTopNav';
import { useApiObservations } from '@/axios/api/observations';
import { useObservations } from '@/context/observationProvider';
import Pagination from '@/components/pagination';
import { router, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function ObservationList() {
  const { t } = useTranslation();
  const { getAllObservations } = useApiObservations();
  const { currentObservationPage, setObservationCurrentPage, observation } =
    useObservations();
  const [refreshing, setRefreshing] = useState(false);

  const searchObservation = async (page?: number) => {
    if (page) {
      setObservationCurrentPage(page);
    }
    await getAllObservations({ page });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await searchObservation(currentObservationPage);
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      searchObservation();
    }, [])
  );

  const backPathOnClick = () => {
    router.back();
  };

  return (
    <ScreenLayout>
      <ScreenTopNav
        title={t('observations')}
        backPathOnClick={backPathOnClick}
        isRoutable={false}
      />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={styles.mainBox}
      >
        {observation?.count ? (
          <FlashList
            estimatedItemSize={6}
            data={observation?.observations}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            renderItem={({ item }) => <MyObservationCard observation={item} />}
          />
        ) : (
          <View style={styles.noObservationsBox}>
            <Text style={styles.textNoObservation}>{t('noObservationsHistoryYet')}</Text>
          </View>
        )}
      </ScrollView>
      <Pagination
        currentPage={currentObservationPage}
        count={observation.count}
        onPageChange={searchObservation}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  mainBox: {
    marginTop: 20,
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
