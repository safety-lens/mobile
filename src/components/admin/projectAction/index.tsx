import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useProjects } from '@/context/projectsProvider';
import Edit from '../../../../assets/svgs/edit';
import Archive from '../../../../assets/svgs/archive';
import Trash from '../../../../assets/svgs/trash';
import EditProjectModal from '../modals/editProject';
import RemoveProject from '../modals/removeProject';
import ArchiveProject from '../modals/archiveProject';
import { useTranslation } from 'react-i18next';
import { UserIcon } from '../../../../assets/svgs/userIcon';
import AddMembers from '../modals/addMembers';

export default function ProjectAction() {
  const { singleProjects } = useProjects();
  const [editModal, setEditModal] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const [archiveModal, setArchiveModal] = useState(false);
  const [addMembersModal, setAddMembersModal] = useState(false);
  const { t } = useTranslation();

  const statusButton = singleProjects?.status === 'Active' ? t('archive') : t('restore');

  const showEditModal = () => {
    setEditModal(!editModal);
  };

  const showArchiveModal = () => {
    setArchiveModal(!archiveModal);
  };

  const showRemoveModal = () => {
    setRemoveModal(!removeModal);
  };
  const showAddMembersModal = () => {
    setAddMembersModal(!addMembersModal);
  };

  return (
    <View>
      <View style={{ marginBottom: 16 }}>
        <View style={styles.actionBox}>
          <TouchableOpacity onPress={showEditModal} style={styles.actionItem}>
            <Edit />
            <Text style={styles.actionItemText}>{t('edit')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={showArchiveModal} style={[styles.actionItem]}>
            <Archive />
            <Text style={styles.actionItemText}>{statusButton}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={showRemoveModal} style={styles.actionItem}>
            <Trash />
            <Text style={styles.actionItemText}>{t('delete')}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={showAddMembersModal}
          style={[styles.actionItem, { maxWidth: '100%' }]}
        >
          <UserIcon fill={'black'} width={20} />
          <Text style={styles.actionItemText}>Members</Text>
        </TouchableOpacity>
      </View>

      <AddMembers
        id={singleProjects?.id}
        title={t('manageMembers')}
        visible={addMembersModal}
        hideModal={showAddMembersModal}
      />
      <EditProjectModal
        title={t('editProject')}
        visible={editModal}
        hideModal={showEditModal}
      />
      <RemoveProject
        status={singleProjects?.status}
        id={singleProjects?.id}
        projectName={singleProjects?.name}
        title={t('deleteProject')}
        visible={removeModal}
        hideModal={showRemoveModal}
      />
      <ArchiveProject
        id={singleProjects?.id}
        projectName={singleProjects?.name}
        status={singleProjects?.status}
        visible={archiveModal}
        hideModal={showArchiveModal}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  actionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  actionItem: {
    maxWidth: '31%',
    width: '100%',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: 'white',

    paddingVertical: 12,
    justifyContent: 'center',
    paddingHorizontal: 14,

    borderColor: '#EBEBEB',
    borderWidth: 1,
    borderRadius: 8,
  },
  actionItemText: {
    color: '#0A2540',
    fontSize: 16,
    fontWeight: '500',
  },
});
