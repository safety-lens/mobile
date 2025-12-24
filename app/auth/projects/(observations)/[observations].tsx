import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { Href, useLocalSearchParams } from 'expo-router';
import { FlashList, ListRenderItem } from '@shopify/flash-list';

import ScreenLayout from '@/components/screenLayout';
import FiltrateObservations, { RangeParams } from '@/components/filtrateObservations';
import ObservationsTab from '@/components/observationsTab';
import ObservationsCard from '@/components/observationsCard';
import ScreenTopNav from '@/components/screenTopNav';
import { useProjects } from '@/context/projectsProvider';
import { statusTitle } from '@/utils/statusTitle';
import { useTranslation } from 'react-i18next';
import { IStatus, Observation } from '@/types/observation';
import { ObservationActionModalsProvider } from '@/context/ObservationActionModalsProvider';
import { ObservationActionModals } from '@/components/modals/ObservationActionModals';
import useObservationsQuery from '@/hooks/queries/useObservationsQuery';
import { ActivityIndicator } from 'react-native-paper';
import { Typography } from '@/components/Typography';

type ObservationsSearchParams = {
  observations?: string;
};

const PAGE_SIZE = 5;

function Observations() {
  const { singleProjects } = useProjects();
  const { observations: status } = useLocalSearchParams<ObservationsSearchParams>();

  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();

  const [range, setRange] = useState<RangeParams>({
    startPeriod: undefined,
    finishPeriod: undefined,
  });

  const { data, refetch, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useObservationsQuery({
      projectId: singleProjects?.id,
      status: statusTitle[status as IStatus],
      startPeriod: range.startPeriod,
      finishPeriod: range.finishPeriod,
      limit: PAGE_SIZE,
    });

  const renderSeparator = useCallback(() => <View style={{ height: 16 }} />, []);

  const observations = useMemo(() => {
    return data?.pages.flatMap((page) => page.observations) || [];
  }, [data]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderItem = useCallback<ListRenderItem<Observation>>(
    (itemInfo) => <ObservationsCard observation={itemInfo} onUpdate={refresh} />,
    [refresh]
  );

  const keyExtractor = useCallback((item: Observation) => item._id, []);

  const counters = useMemo(() => {
    const firstPage = data?.pages[0];
    return {
      addressedCount: firstPage?.addressedCount || 0,
      inProgressCount: firstPage?.inProgressCount || 0,
      notAddressedCount: firstPage?.notAddressedCount || 0,
    };
  }, [data]);

  const onEndReached = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage]);

  return (
    <ScreenLayout>
      <View style={styles.navTop}>
        <ScreenTopNav
          title={t('observations')}
          backPath={`/auth/projects/(id)/${singleProjects?.id}` as Href}
        />
        <ObservationsTab counters={counters} status={status as never} />
        <FiltrateObservations onRange={setRange} />
      </View>
      <FlashList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        keyExtractor={keyExtractor}
        estimatedItemSize={540}
        data={observations}
        ItemSeparatorComponent={renderSeparator}
        renderItem={renderItem}
        onEndReached={onEndReached}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={{ paddingVertical: 16 }} />
          ) : null
        }
        ListEmptyComponent={
          <View>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Typography center>{t('noObservationsHistoryYet')}</Typography>
            )}
          </View>
        }
        contentContainerStyle={styles.content}
      />
      <ObservationActionModals
        projectId={singleProjects?.id}
        onUpdateObservation={refresh}
      />
    </ScreenLayout>
  );
}

export default function ObservationWithProviders() {
  return (
    <ObservationActionModalsProvider>
      <Observations />
    </ObservationActionModalsProvider>
  );
}

const styles = StyleSheet.create({
  navTop: {
    gap: 16,
    marginBottom: 10,
  },
  content: {
    paddingVertical: 20,
  },
});
