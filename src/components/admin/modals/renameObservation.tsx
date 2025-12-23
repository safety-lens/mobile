import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from '@/modal';
import CustomButton from '@/components/CustomButton/button';
import IconClose from '../../../../assets/svgs/iconClose';
import { useForm } from 'react-hook-form';
import TextField from '@/components/form/textField';
import { useApiObservations } from '@/axios/api/observations';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

interface IRenameObservation {
  visible: boolean;
  hideModal: () => void;
  title?: string;
  value?: string;
  observationId: string;
  onUpdate?: () => void;
}

interface IRenameObservationForm {
  projectName: string;
}

export default function RenameObservation({
  visible = false,
  hideModal,
  title,
  value = '',
  observationId,
  onUpdate,
}: IRenameObservation) {
  const { updateObservations, getFilterObservations, getAllObservations } =
    useApiObservations();
  const { t } = useTranslation();

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      projectName: value,
    },
  });

  const onSubmit = async (data: IRenameObservationForm) => {
    await updateObservations({
      observationId,
      data: {
        name: data.projectName,
      },
    })
      .then(async () => {
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: t('observationUpdate'),
        });
        onUpdate && onUpdate();
      })
      .finally(() => hideModal());
    reset();
  };

  useEffect(() => {
    setValue('projectName', value);
  }, [value]);

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
          <TextField<IRenameObservationForm>
            control={control}
            errors={errors}
            label={t('name')}
            name="projectName"
            required
            placeholder="New project"
          />
        </View>

        <View style={styles.buttonBox}>
          <CustomButton
            onPress={hideModal}
            title={t('cancelButton')}
            backgroundColor="#fff"
            outline
          />

          <CustomButton
            title={t('confirm')}
            onPress={handleSubmit(onSubmit)}
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
  buttonBox: {
    flexDirection: 'row',
    gap: 8,
  },
});
