import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from '@/modal';
import CustomButton from '@/components/CustomButton/button';
import IconClose from '../../../../assets/svgs/iconClose';
import { useApiProject } from '@/axios/api/projects';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';
import { useTranslation } from 'react-i18next';
import { useProjects } from '@/context/projectsProvider';
import Toast from 'react-native-toast-message';

type status = 'Active' | 'Archived';

interface IRemoveProject {
  visible: boolean;
  hideModal: () => void;
  title?: string;
  projectName?: string;
  id?: string;
  status?: status;
}

export default function RemoveProject({
  id,
  visible = false,
  hideModal,
  title,
  projectName,
  status,
}: IRemoveProject) {
  const { setSingleProject } = useProjects();
  const { deleteProject, getAllProject } = useApiProject();
  const { user } = useAuth();
  const { t } = useTranslation();

  const onSubmit = async () => {
    if (id && user) {
      await deleteProject({ projectId: id })
        .then(() => {
          getAllProject({ userId: user.auth.id, status });
          Toast.show({
            type: 'success',
            text1: t('success'),
            text2: t('projectDeleted'),
          });
          router.navigate('/auth/projects');
        })
        .finally(() => hideModal());
      setSingleProject(null);
    }
  };

  return (
    <Modal visible={visible} hideModal={hideModal}>
      <>
        <View style={styles.formHead}>
          <Text style={styles.formHeadText}>{title}</Text>

          <TouchableOpacity onPress={hideModal}>
            <IconClose />
          </TouchableOpacity>
        </View>

        <View style={styles.textAreaBox}>
          <Text style={styles.textArea}>
            {t('deleteProjectText')} <Text style={styles.textProject}>{projectName}</Text>
            ? {t('cannotBeUndone')}
          </Text>
        </View>

        <View style={styles.buttonBox}>
          <CustomButton
            onPress={hideModal}
            title={t('cancelButton')}
            backgroundColor="#fff"
            outline
          />

          <CustomButton
            title={t('delete')}
            onPress={onSubmit}
            styleAppBtn={{
              flex: 1,
            }}
          />
        </View>
      </>
    </Modal>
  );
}

const styles = StyleSheet.create({
  formHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formHeadText: {
    color: '#0A2540',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  textAreaBox: {
    marginVertical: 40,
  },
  textArea: {
    color: '#0A2540',
    fontSize: 16,
    lineHeight: 21,
  },
  textProject: {
    fontWeight: '700',
  },
  buttonBox: {
    flexDirection: 'row',
    gap: 8,
  },
});
