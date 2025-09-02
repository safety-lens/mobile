import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Modal from '@/modal';
import IconClose from '../../../../assets/svgs/iconClose';
import CustomButton from '@/components/CustomButton/button';
import { useTranslation } from 'react-i18next';
import { useApiObservations } from '@/axios/api/observations';
import Toast from 'react-native-toast-message';
import { DatePickerModal } from 'react-native-paper-dates';
import useGetUserInfo from '@/hooks/getUserInfo';
import RNDateTimePicker from '@react-native-community/datetimepicker';

type status = 'Active' | 'Archived';

interface IChangeDeadline {
  visible: boolean;
  hideModal: () => void;
  title?: string;
  projectName?: string;
  status?: status;
  observationId?: string;
  selectedStatus?: string;
  projectId?: string;
  defaultValue?: Date;
}

export default function ChangeDeadline({
  visible = false,
  hideModal,
  title,
  observationId,
  selectedStatus,
  projectId,
  defaultValue,
}: IChangeDeadline) {
  const { lang } = useGetUserInfo();

  const { updateObservations, getFilterObservations, getAllObservations } =
    useApiObservations();

  const [date, setDate] = useState(new Date(defaultValue || new Date()));
  const [visibleTimePicker, setVisibleTimePicker] = useState(false);
  const [visibleDatePicker, setVisibleDatePicker] = useState(false);
  const { t } = useTranslation();

  const onSubmit = async () => {
    await updateObservations({
      observationId: observationId || '',
      data: {
        deadline: date,
      },
    })
      .then(async () => {
        if (projectId) {
          await getFilterObservations({
            status: selectedStatus,
            projectId: projectId,
          });
        } else {
          await getAllObservations({});
        }
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: t('observationUpdate'),
        });
      })
      .finally(() => hideModal());
    hideModal();
  };

  const onDismiss = () => {
    setVisibleTimePicker(false);
    setVisibleDatePicker(false);
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

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            style={{ flex: 1, width: '100%' }}
            onPress={() => setVisibleDatePicker(true)}
          >
            <Text style={styles.dateTimeText}>
              <Text style={{ fontWeight: '700' }}>Date: </Text>
              {date?.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1, width: '100%' }}
            onPress={() => setVisibleTimePicker(true)}
          >
            <Text style={styles.dateTimeText}>
              <Text style={{ fontWeight: '700' }}>Time: </Text>
              {date?.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </Text>
          </TouchableOpacity>
        </View>

        {visibleTimePicker && (
          <RNDateTimePicker
            mode="time"
            value={date}
            is24Hour={true}
            initialInputMode="default"
            fullscreen={true}
            display="spinner"
            onChange={(_, date) => {
              setDate(date as Date);
              onDismiss();
            }}
          />
        )}
        <DatePickerModal
          locale={lang ?? 'en'}
          mode="single"
          date={date}
          visible={visibleDatePicker}
          onDismiss={onDismiss}
          onConfirm={({ date }) => {
            setDate(date as Date);
            onDismiss();
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
            disabled={!date}
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
  dateTimeText: {
    borderColor: '#D0D5DD',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
});
