import React, { memo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import ScreenLayout from '@/components/screenLayout';
import ObservationStatusCard from '@/components/observationStatusCard';
import PinOnMap from '@/components/pinOnMap';
import ScreenTopNav from '@/components/screenTopNav';
import ProjectAction from '@/components/admin/projectAction';
import ProjectDropdown from '@/components/projectDropdown';
import { useApiProject } from '@/axios/api/projects';
import { useProjects } from '@/context/projectsProvider';
import { useObservations } from '@/context/observationProvider';
import Skeleton from '@/components/skeleton';
import { useTranslation } from 'react-i18next';
import useGetUserInfo from '@/hooks/getUserInfo';
import SLLogo from '../../../../assets/svgs/SLlogo';
import { useApiSignIn } from '@/axios/api/auth';
import useObservationsPaginatedQuery from '@/hooks/queries/useObservationsPaginatedQuery';

const ProjectId = memo(function ProjectId() {
  const { t } = useTranslation();
  const { saveLastVisitedProject } = useApiSignIn();
  const { id } = useLocalSearchParams();
  const { getSingleProject, isLoading } = useApiProject();
  const { singleProjects, setSingleProject } = useProjects();
  const { setObservation } = useObservations();
  const { isAdmin, user } = useGetUserInfo();
  const observationsQuery = useObservationsPaginatedQuery({
    page: 1,
    limit: 1000, // TODO: Need to have lightweight endpoint to get only points and counters
    projectId: singleProjects?.id as string,
  });

  const [refreshing, setRefreshing] = useState(false);

  const searchProject = async () => {
    if (id) {
      await getSingleProject({
        id: id as string,
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await searchProject();
    setRefreshing(false);
  };

  const goToProjects = () => {
    setSingleProject(null);
    setObservation({
      observations: [],
      count: 0,
      addressedCount: 0,
      inProgressCount: 0,
      notAddressedCount: 0,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      if (singleProjects?.id) {
        saveLastVisitedProject(singleProjects?.id as string);
      }
    }, [singleProjects?.id])
  );

  useFocusEffect(
    React.useCallback(() => {
      searchProject();
    }, [id])
  );

  return (
    <ScreenLayout>
      <Skeleton isLoading={isLoading} />
      <View>
        <ScreenTopNav
          logoLeft={<SLLogo />}
          title={`${t('welcome')}, ${user?.user.name || ''}!`}
          backPath={'/auth/projects'}
          backPathOnClick={goToProjects}
        />
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.dropdown}>
          <ProjectDropdown
            redirect={true}
            currentId={singleProjects?.id || (id as string)}
          />
        </View>

        <View style={styles.pinOnMapBox}>
          <PinOnMap
            editable={false}
            imageMap={singleProjects?.mainPhoto}
            observations={observationsQuery.data?.observations || []}
          />
        </View>

        {isAdmin && <ProjectAction />}

        <View style={styles.statusCardBox}>
          <ObservationStatusCard
            id={id as string}
            status="addressed"
            number={observationsQuery.data?.addressedCount || 0}
          />
          <ObservationStatusCard
            id={id as string}
            status="inProgress"
            number={observationsQuery.data?.inProgressCount || 0}
          />
          <ObservationStatusCard
            id={id as string}
            status="notAddressed"
            number={observationsQuery.data?.notAddressedCount || 0}
          />
        </View>
      </ScrollView>
    </ScreenLayout>
  );
});

export default ProjectId;

const styles = StyleSheet.create({
  dropdown: {
    marginBottom: 16,
  },
  statusCardBox: {
    gap: 8,
  },
  pinOnMapBox: {
    marginBottom: 16,
  },
});
