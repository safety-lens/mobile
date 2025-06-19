import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from '@/modal';
import CustomButton from '@/components/CustomButton/button';
import IconClose from '../../../../assets/svgs/iconClose';
import { useApiProject } from '@/axios/api/projects';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/context/AuthProvider';
import { useTranslation } from 'react-i18next';

type status = 'Active' | 'Archived';

interface IRemoveProject {
  visible: boolean;
  hideModal: () => void;
  projectName?: string;
  id?: string;
  status?: status;
}

export default function ArchiveProject({
  id,
  visible = false,
  hideModal,
  projectName,
  status,
}: IRemoveProject) {
  const { archiveProject, getAllProject, getSingleProject } = useApiProject();
  const { user } = useAuth();
  const { t } = useTranslation();
  const statusProject = status === 'Active' ? 'Archived' : 'Active';
  const statusProjectText = status === 'Active' ? t('archive') : t('restore');
  const isUserId = user?.auth.role !== 'user' ? user?.auth.id : undefined;

  const onSubmit = async () => {
    if (id) {
      await archiveProject({ projectId: id, status: statusProject })
        .then(() => {
          Toast.show({
            type: 'success',
            text1: t('success'),
            text2: status === 'Active' ? t('projectArchived') : t('projectRestored'),
          });
        })
        .finally(() => {
          hideModal();
        });
      await getSingleProject({ id: id as string });
      await getAllProject({ userId: isUserId, status: statusProject });
    }
  };

  return (
    <Modal visible={visible} hideModal={hideModal}>
      <>
        <View style={styles.formHead}>
          <Text style={styles.formHeadText}>
            {statusProjectText} {t('theProject')}
          </Text>

          <TouchableOpacity onPress={hideModal}>
            <IconClose />
          </TouchableOpacity>
        </View>

        <View style={styles.textAreaBox}>
          <Text style={styles.textArea}>
            {t('archiveProjectText', { statusProjectText })}{' '}
            <Text style={styles.textProject}>{projectName}</Text>?
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
            title={statusProjectText}
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
