import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import ScreenLayout from '@/components/screenLayout';
import MyObservationCard, { APPROX_ITEM_HEIGHT } from '@/components/myObservationCard';
import ScreenTopNav from '@/components/screenTopNav';
import { useApiObservations } from '@/axios/api/observations';
import { useObservations } from '@/context/observationProvider';
import Pagination from '@/components/pagination';
import { router, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Observation } from '@/types/observation';
import { ObservationActionModals } from '@/components/modals/ObservationActionModals';
import { ObservationActionModalsProvider } from '@/context/ObservationActionModalsProvider';

function ObservationList() {
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

  const renderItem = useCallback<ListRenderItem<Observation>>(
    ({ item }) => <MyObservationCard observation={item} />,
    []
  );

  const keyExtractor = useCallback((item: Observation) => item._id, []);

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
            estimatedItemSize={APPROX_ITEM_HEIGHT}
            data={observation?.observations}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            renderItem={renderItem}
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
      <ObservationActionModals onUpdateObservation={onRefresh} />
    </ScreenLayout>
  );
}

export default function ObservationListWithProviders() {
  return (
    <ObservationActionModalsProvider>
      <ObservationList />
    </ObservationActionModalsProvider>
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
