import React, { useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Href, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';

import ScreenLayout from '@/components/screenLayout';
import FiltrateObservations, { DareRange } from '@/components/filtrateObservations';
import ObservationsTab from '@/components/observationsTab';
import ObservationsCard from '@/components/observationsCard';
import ScreenTopNav from '@/components/screenTopNav';
import { useApiObservations } from '@/axios/api/observations';
import { useProjects } from '@/context/projectsProvider';
import { useObservations } from '@/context/observationProvider';
import { statusTitle } from '@/utils/statusTitle';
import { useTranslation } from 'react-i18next';
import { IStatus } from '@/types/observation';

export default function Observations() {
  const { getFilterObservations } = useApiObservations();
  const { singleProjects } = useProjects();
  const { singleObservation } = useObservations();
  const { observations: status, id } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();

  const [range, setRange] = useState<DareRange>({
    startPeriod: undefined,
    finishPeriod: undefined,
  });

  const searchObservations = async () => {
    setRefreshing(true);
    await getFilterObservations({
      projectId: singleProjects?.id as string,
      status: statusTitle[status as IStatus],
      page: 1,
      ...range,
    });
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      searchObservations();
    }, [id, status, range])
  );

  return (
    <ScreenLayout>
      <View style={styles.navTop}>
        <ScreenTopNav
          title={t('observations')}
          backPath={`/auth/projects/(id)/${singleProjects?.id}` as Href}
        />
        <ObservationsTab status={status as never} />
        <FiltrateObservations onRange={setRange} />
      </View>
      <FlashList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={searchObservations} />
        }
        estimatedItemSize={6}
        data={singleObservation?.observations}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        renderItem={(observation) => <ObservationsCard observation={observation} />}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  navTop: {
    paddingBottom: 16,
    gap: 16,
  },
});
