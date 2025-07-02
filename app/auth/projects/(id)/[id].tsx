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
import { useApiObservations } from '@/axios/api/observations';
import { useObservations } from '@/context/observationProvider';
import Skeleton from '@/components/skeleton';
import { useTranslation } from 'react-i18next';
import useGetUserInfo from '@/hooks/getUserInfo';
import SLLogo from '../../../../assets/svgs/SLlogo';
import { useApiSignIn } from '@/axios/api/auth';

const ProjectId = memo(function ProjectId() {
  const { t } = useTranslation();
  const { saveLastVisitedProject } = useApiSignIn();
  const { id } = useLocalSearchParams();
  const { getSingleProject, isLoading } = useApiProject();
  const { getAllObservations } = useApiObservations();
  const { singleProjects, setSingleProject } = useProjects();
  const { observation, setObservation } = useObservations();
  const { isAdmin, user } = useGetUserInfo();

  const [refreshing, setRefreshing] = useState(false);

  const searchProject = async () => {
    if (id) {
      const singleProject = await getSingleProject({
        id: id as string,
      });
      await getAllObservations({
        projectId: singleProject?.id as string,
        page: 1,
        rowsPerPage: 1000,
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
            observations={observation.observations}
          />
        </View>

        {isAdmin && <ProjectAction />}

        <View style={styles.statusCardBox}>
          <ObservationStatusCard
            id={id as string}
            status="addressed"
            number={observation.addressedCount}
          />
          <ObservationStatusCard
            id={id as string}
            status="inProgress"
            number={observation.inProgressCount}
          />
          <ObservationStatusCard
            id={id as string}
            status="notAddressed"
            number={observation.notAddressedCount}
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
