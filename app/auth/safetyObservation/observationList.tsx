import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useCallback, useRef, useState } from 'react';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import ScreenLayout from '@/components/screenLayout';
import MyObservationCard, { APPROX_ITEM_HEIGHT } from '@/components/myObservationCard';
import ScreenTopNav from '@/components/screenTopNav';
import Pagination from '@/components/pagination';

import { useTranslation } from 'react-i18next';
import { Observation } from '@/types/observation';
import { ObservationActionModals } from '@/components/modals/ObservationActionModals';
import { ObservationActionModalsProvider } from '@/context/ObservationActionModalsProvider';
import useObservationsPaginatedQuery from '@/hooks/queries/useObservationsPaginatedQuery';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';

const PAGE_SIZE = 20;

function ObservationList() {
  const router = useRouter();
  const listRef = useRef<FlashList<Observation>>(null);
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data, refetch, isLoading } = useObservationsPaginatedQuery({
    page,
    limit: PAGE_SIZE,
  });

  const backPathOnClick = () => {
    router.back();
  };

  const renderItem = useCallback<ListRenderItem<Observation>>(
    ({ item }) => <MyObservationCard observation={item} />,
    []
  );

  const keyExtractor = useCallback((item: Observation) => item._id, []);

  const refreshPage = useCallback(() => {
    refetch();
  }, [refetch]);

  const switchPage = useCallback((newPage: number) => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
    setPage(newPage);
  }, []);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  return (
    <ScreenLayout>
      <ScreenTopNav
        title={t('observations')}
        backPathOnClick={backPathOnClick}
        isRoutable={false}
      />

      <FlashList
        ref={listRef}
        estimatedItemSize={APPROX_ITEM_HEIGHT}
        data={data?.observations}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
        ListEmptyComponent={
          <View style={styles.noObservationsBox}>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.textNoObservation}>
                {t('noObservationsHistoryYet')}
              </Text>
            )}
          </View>
        }
        contentContainerStyle={styles.content}
      />
      {data?.count ? (
        <Pagination
          currentPage={page}
          pageSize={PAGE_SIZE}
          count={data?.count}
          onPageChange={switchPage}
        />
      ) : null}
      <ObservationActionModals onUpdateObservation={refreshPage} />
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
  content: {
    paddingVertical: 20,
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
