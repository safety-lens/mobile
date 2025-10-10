import ScreenLayout from '@/components/screenLayout';
import Search from '@/components/search';
import ListOfProjects from '@/components/listOfProjects';
import React from 'react';
import CreateNewProject from '@/components/createNewProject';
import ProjectsFilter from '@/components/projectsFilter';
import { StyleSheet, View } from 'react-native';
import ScreenTopNav from '@/components/screenTopNav';
import { useTranslation } from 'react-i18next';
import useGetUserInfo from '@/hooks/getUserInfo';
import { SubscriptionGuard } from '@/components/subscriptionGuard';

export default function Projects() {
  const { t } = useTranslation();
  const { isAdmin } = useGetUserInfo();

  return (
    <ScreenLayout>
      <SubscriptionGuard>
        <ScreenTopNav
          icon={isAdmin ? <CreateNewProject /> : undefined}
          title={t('myProjects')}
        />
        <View style={styles.searchContainer}>
          <Search />
          <ProjectsFilter />
        </View>
        <ListOfProjects />
      </SubscriptionGuard>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    gap: 12,
    marginVertical: 12,
  },
});
