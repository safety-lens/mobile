import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from '@/modal';
import CustomButton from '@/components/CustomButton/button';
import IconClose from '../../../../assets/svgs/iconClose';
import { useApiObservations } from '@/axios/api/observations';
import { useTranslation } from 'react-i18next';
import { Observation } from '@/types/observation';
import { useSegments } from 'expo-router';
import { useObservations } from '@/context/observationProvider';
import Toast from 'react-native-toast-message';

interface IRemoveObservation {
  visible: boolean;
  hideModal: () => void;
  title?: string;
  observationName?: string;
  observationId: string;
  returnSameStatus: Observation | boolean;
}

export default function RemoveObservation({
  visible = false,
  hideModal,
  title,
  observationName,
  observationId,
  returnSameStatus,
}: IRemoveObservation) {
  const { currentObservationPage } = useObservations();
  const { deleteObservation, getAllObservations, getFilterObservations } =
    useApiObservations();
  const { t } = useTranslation();
  const segments = useSegments();

  //check user rout for correct delete logic
  const isObservationList =
    segments[segments.length - 1] === 'observationList'
      ? currentObservationPage
      : undefined;

  const onSubmit = async () => {
    await deleteObservation({ observationId })
      .then(async () => {
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: t('observationDeleted'),
        });
        if (returnSameStatus as Observation) {
          // await new Promise((resolve) => setTimeout(resolve, 100));
          await getFilterObservations({
            status: (returnSameStatus as Observation).status,
            projectId: (returnSameStatus as Observation).projectId,
          });
        } else {
          await getAllObservations({ page: isObservationList });
        }
      })
      .finally(() => hideModal());
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
            {t('deleteObservationText')}{' '}
            <Text style={styles.textProject}>{observationName}</Text>?{' '}
            {t('cannotBeUndone')}
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
