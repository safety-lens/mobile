import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from '@/modal';
import IconClose from '../../../../assets/svgs/iconClose';
import { useApiUser } from '@/axios/api/users';
import { UserList } from '@/axios/api/auth';
import CustomButton from '@/components/CustomButton/button';
import { useTranslation } from 'react-i18next';
import DropdownItem from '@/components/dropdown';
import { useApiObservations } from '@/axios/api/observations';
import Toast from 'react-native-toast-message';

type status = 'Active' | 'Archived';

interface IChangeAssignee {
  visible: boolean;
  hideModal: () => void;
  title?: string;
  projectName?: string;
  id?: string;
  status?: status;
  observationId?: string;
  onUpdate?: () => void;
  defaultValue?: {
    _id: string;
    email: string;
  }[];
}

export default function ChangeAssignee({
  visible = false,
  hideModal,
  title,
  id,
  observationId,
  defaultValue,
  onUpdate,
}: IChangeAssignee) {
  const { getUsersNameEmailList } = useApiUser();
  const { updateObservations } = useApiObservations();

  const [users, setUsers] = useState<UserList[]>([]);
  const [selectedUser, setSelectedUser] = useState<string[]>([]);

  const { t } = useTranslation();

  const updateSingleProject = async () => {
    await getUsersNameEmailList(id as string).then((res) => setUsers(res || []));
  };

  useEffect(() => {
    if (visible) {
      updateSingleProject();
    }
  }, [id, visible]);

  const onSubmit = async () => {
    console.log(selectedUser);
    await updateObservations({
      observationId: observationId || '',
      data: {
        assignees: selectedUser[0] !== 'none' ? selectedUser : [],
      },
    })
      .then(async () => {
        onUpdate && onUpdate();
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: t('observationUpdate'),
        });
      })
      .finally(() => hideModal());
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

        <DropdownItem
          data={users.map((user) => ({
            label: user.name,
            value: user.id,
          }))}
          defaultValue={defaultValue?.[0]?._id || ''}
          placeholder={t('chooseAssignee')}
          onChange={(e) => setSelectedUser([e.value])}
          label={t('assignees')}
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
    marginBottom: 20,
  },
  buttonBox: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
  },
});
