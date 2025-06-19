import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useProjects } from '@/context/projectsProvider';
import { IProjectCart } from '@/types/project';
import Pagination from '@/components/pagination';
import ProjectCart from './projectCart/projectCart';
import { useApiProject } from '@/axios/api/projects';
import { useAuth } from '@/context/AuthProvider';
import { useTranslation } from 'react-i18next';

export default function ListOfProjects() {
  const { getAllProject } = useApiProject();
  const { user } = useAuth();
  const { projects, statusFilter } = useProjects();
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();

  const isUserId = user?.auth.role !== 'user' ? user?.auth.id : undefined;

  const uploadNewPage = async (page: number) => {
    setCurrentPage(page);
    await getAllProject({ userId: isUserId, page, status: statusFilter });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getAllProject({ userId: isUserId, page: currentPage, status: statusFilter });
    setRefreshing(false);
  };

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {projects.projects.length ? (
        <FlashList
          // extraData={user}
          estimatedItemSize={6}
          data={projects.projects}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          renderItem={({ item }) => <ProjectCart projectData={item as IProjectCart} />}
        />
      ) : (
        <View style={styles.noProjectsBox}>
          <Text style={styles.textNoProjects}>
            {statusFilter === 'Active'
              ? t('noProjectsYetActive')
              : t('noProjectsYetArchived')}
          </Text>
        </View>
      )}
      <View>
        <Pagination
          currentPage={currentPage}
          count={projects.count}
          onPageChange={uploadNewPage}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  noProjectsBox: {
    marginTop: '60%',
    alignItems: 'center',
  },
  textNoProjects: {
    fontSize: 16,
    lineHeight: 25,
    color: '#6D7176',
    textAlign: 'center',
  },
});
