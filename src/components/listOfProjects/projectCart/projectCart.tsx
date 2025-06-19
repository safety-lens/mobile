import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import React from 'react';
import { IProjectCart } from '@/types/project';
import { router } from 'expo-router';
import { dateFormat } from '@/utils/dateFormat';
import { useTranslation } from 'react-i18next';
import ImageBox from '@/components/pinOnMap/imageBox';

interface IProjectCarts {
  projectData: IProjectCart;
}

export default function ProjectCart({ projectData }: IProjectCarts) {
  const { t } = useTranslation();
  const push = (projectData: IProjectCart) => {
    if (projectData.id) router.navigate(`/auth/projects/(id)/${projectData.id}`);
  };
  const status = projectData.status !== 'Active' ? t('archive') : t('active');

  return (
    <TouchableOpacity onPress={() => push(projectData)}>
      <ImageBox url={projectData.mainPhoto} />
      <View style={styles.description}>
        <View style={[styles.statusBox, styles[projectData.status]]}>
          <Text style={styles[projectData.status]}>{status}</Text>
        </View>
        <Text style={styles.name}>
          {projectData.name}{' '}
          {projectData?.projectNumber && (
            <Text style={styles.projectNumber}>#{projectData?.projectNumber}</Text>
          )}
        </Text>
        <Text style={styles.createdAt}>{dateFormat(projectData?.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  description: {
    borderColor: '#EBEBEB',
    borderWidth: 1,
    borderTopWidth: 0,
    padding: 16,
    gap: 8,
    borderEndEndRadius: 16,
    borderEndStartRadius: 16,

    alignItems: 'flex-start',
  },
  image: {
    borderTopEndRadius: 16,
    borderTopLeftRadius: 16,
    width: '100%',
    height: 300,
    resizeMode: 'stretch',
  },
  statusBox: {
    borderRadius: 4,
    marginBottom: 8,
  },
  Active: {
    color: 'white',
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: '#009951',
    fontWeight: '500',
  },
  Archived: {
    color: '#667085',
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: '#F2F4F7',
    fontWeight: '500',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  projectNumber: {
    color: '#667085',
  },
  createdAt: {
    color: '#6D7176',
    fontSize: 16,
    fontWeight: '500',
  },
});
