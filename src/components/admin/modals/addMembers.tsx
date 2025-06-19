import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from '@/modal';
import IconClose from '../../../../assets/svgs/iconClose';
import MultiSelectDropdown from '@/components/MultiSelectDropdown';
import { useApiUser } from '@/axios/api/users';
import { UserList } from '@/axios/api/auth';
import CustomButton from '@/components/CustomButton/button';
import { useTranslation } from 'react-i18next';
import { useApiProject } from '@/axios/api/projects';

type status = 'Active' | 'Archived';

interface IRemoveProject {
  visible: boolean;
  hideModal: () => void;
  title?: string;
  projectName?: string;
  id?: string;
  status?: status;
}

export default function AddMembers({
  visible = false,
  hideModal,
  title,
  id,
}: IRemoveProject) {
  const { getUsersNameEmailList } = useApiUser();
  const { getProjectMembers, addMembersToProject } = useApiProject();

  const [users, setUsers] = useState<UserList[]>([]);
  const [selectedUser, setSelectedUser] = useState<string[]>([]);

  const { t } = useTranslation();

  const getUsers = async () => {
    const users = await getUsersNameEmailList();
    const selectedUser = await getProjectMembers({ projectId: id as string });

    setUsers(users);
    setSelectedUser(selectedUser.map((item) => item.id));
  };

  useEffect(() => {
    if (visible) {
      getUsers();
    }
  }, [id, visible]);

  const onSubmit = async () => {
    addMembersToProject({ projectId: id as string, usersIds: selectedUser });
    hideModal();
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

        <MultiSelectDropdown
          data={users}
          defaultValue={selectedUser}
          onChange={(selectedItems) => {
            setSelectedUser(selectedItems as string[]);
          }}
        />

        <View style={styles.buttonBox}>
          <CustomButton
            onPress={hideModal}
            title={t('cancelButton')}
            backgroundColor="#fff"
            outline
          />

          <CustomButton
            title={t('save')}
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
    marginBottom: 10,
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
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
  },
});
