import Modal from '@/modal';
import React from 'react';

import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import IconClose from '../../../../assets/svgs/iconClose';
import CustomButton from '@/components/CustomButton/button';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { ObservationsResponse } from '@/types/observation';
import { AxiosResponse } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiInstance } from '@/axios';

export default function EditNoteModal({
  visible,
  hideModal,
  defaultNote,
  observationId,
}: {
  visible: boolean;
  hideModal: () => void;
  defaultNote: string;
  observationId: string;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [note, setNote] = React.useState(defaultNote);

  const { mutate: updateObservation } = useMutation({
    mutationFn: async () => {
      const response: AxiosResponse<ObservationsResponse> = await apiInstance.put(
        `/observations/${observationId}`,
        {
          note,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['observations'] });
      Toast.show({
        type: 'success',
        text1: t('success'),
        text2: t('observationUpdate'),
      });
      hideModal();
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('observationUpdate'),
      });
    },
  });

  return (
    <Modal visible={visible} hideModal={hideModal}>
      <>
        <View style={styles.header}>
          <Text style={styles.title}>{t('editCommentary')}</Text>
          <TouchableOpacity onPress={hideModal}>
            <IconClose />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <TextInput
            style={styles.inputField}
            onChangeText={setNote}
            value={note}
            multiline={true}
            placeholder={t('addNote')}
          />
        </View>

        <View style={styles.footer}>
          <CustomButton
            styleAppBtn={{ width: '100%' }}
            title={t('save')}
            onPress={updateObservation}
          />
        </View>
      </>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A2540',
  },
  content: {
    marginTop: 20,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    gap: 36,
    marginTop: 12,
  },
  radioButton: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  inputField: {
    minHeight: 100,
    paddingHorizontal: 8,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    color: 'black',
  },
  footer: {
    marginTop: 20,
    gap: 12,
    flexDirection: 'row',
  },
});
