import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from '@/modal';
import IconClose from '../../../../assets/svgs/iconClose';
import MultiSelectDropdown, { IDropdownItem } from '@/components/MultiSelectDropdown';
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
    const userList = await getUsersNameEmailList();
    const projectMembers = await getProjectMembers({ projectId: id as string });

    setUsers(userList);
    setSelectedUser(projectMembers.map((item) => item.id));
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

  const usersDropdownData: IDropdownItem[] = useMemo(() => {
    return users.map((user) => ({
      label: user.name,
      labelSelected: `${user.name} – ${user.email}`,
      value: user.id,
    }));
  }, [users]);

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
          data={usersDropdownData}
          defaultValue={selectedUser}
          onChange={(selectedItems) => {
            console.log('🚀 ~ AddMembers ~ selectedItems:', selectedItems);
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
