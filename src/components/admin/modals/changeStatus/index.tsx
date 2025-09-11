import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from '@/modal';
import CustomButton from '@/components/CustomButton/button';
import IconClose from '../../../../../assets/svgs/iconClose';
import DropdownItem from '@/components/dropdown';
import { useApiObservations } from '@/axios/api/observations';
import { Observation, StatusTitle } from '@/types/observation';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

interface IChangeStatus {
  visible: boolean;
  hideModal: () => void;
  observationId: string;
  currentStatus?: StatusTitle;
  returnSameStatus?: Observation | boolean;
}

const dataStatus = (t: (key: string) => string) => [
  { label: t('addressed'), value: 'Addressed' },
  { label: t('inProgress'), value: 'In progress' },
  { label: t('notAddressed'), value: 'Not addressed' },
];

export default function ChangeStatus({
  visible = false,
  hideModal,
  observationId,
  currentStatus,
  returnSameStatus,
}: IChangeStatus) {
  const { updateObservations, getFilterObservations, getAllObservations } =
    useApiObservations();
  const { t } = useTranslation();
  const data = dataStatus(t);

  const [text, setText] = useState<string>('');
  const [textError, setTextError] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusTitle | undefined>(
    currentStatus
  );

  const onSubmit = async () => {
    if (selectedStatus === 'Addressed') {
      if (!text) {
        setTextError(true);
        return;
      }
    }
    await updateObservations({
      observationId,
      data: {
        status: selectedStatus,
        implementedActions: text || undefined,
      },
    }).then(async () => {
      Toast.show({
        type: 'success',
        text1: t('success'),
        text2: t('observationUpdate'),
      });
      if (returnSameStatus as Observation) {
        await getFilterObservations({
          status: (returnSameStatus as Observation).status,
          projectId: (returnSameStatus as Observation).projectId,
        });
      } else {
        await getAllObservations({});
      }
      // setStatusFilter((returnSameStatus as Observation).status);
      setSelectedStatus(undefined);
      hideModal();
    });
  };

  useEffect(() => {
    setText('');
    setTextError(false);
  }, [selectedStatus]);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  return (
    <Modal visible={visible} hideModal={hideModal} keyboardUp>
      <>
        <View style={styles.formHead}>
          <Text style={styles.formHeadText}>{t('changeStatus')}</Text>

          <TouchableOpacity onPress={hideModal}>
            <IconClose />
          </TouchableOpacity>
        </View>

        <View style={styles.dropdownItem}>
          <DropdownItem
            defaultValue={currentStatus}
            placeholder="Select Status"
            data={data}
            onChange={(e) => setSelectedStatus(e.value as StatusTitle)}
          />
        </View>

        {selectedStatus === 'Addressed' && (
          <View style={styles.textBox}>
            <Text style={styles.textTitle}>{t('implementedActions')}</Text>
            <TextInput
              style={[styles.textInput, { textAlignVertical: 'top' }]}
              multiline={true}
              onChangeText={setText}
              onChange={() => setTextError(false)}
            />
            {textError && <Text style={styles.error}>{t('required')}</Text>}
          </View>
        )}

        <View style={styles.buttonBox}>
          <CustomButton
            onPress={hideModal}
            title={t('cancelButton')}
            backgroundColor="#fff"
            styleBtn={{ color: '#000' }}
            styleAppBtn={{
              borderColor: '#D0D5DD',
              borderWidth: 1,
              borderRadius: 8,
              flex: 1,
            }}
          />
          <CustomButton
            title={t('change')}
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
  dropdownItem: {
    marginTop: 20,
  },
  textBox: {
    marginTop: 24,
    gap: 8,
  },
  textTitle: {
    color: '#0A2540',
    fontSize: 17,
    fontWeight: '500',
  },
  textInput: {
    height: 100,
    borderColor: '#D0D5DD',
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    backgroundColor: 'white',
  },
  buttonBox: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 8,
  },
  error: {
    borderColor: 'red',
    color: 'red',
  },
});
