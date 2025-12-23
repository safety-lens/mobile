import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Repeat from '../../../assets/svgs/repeat';
import ChangeStatus from '../admin/modals/changeStatus';
import { Observation, StatusTitle } from '@/types/observation';
import { useTranslation } from 'react-i18next';

function ChangeStatusButton({
  observation,
  status,
  onUpdate,
}: {
  observation: Observation;
  status: StatusTitle;
  onUpdate?: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const showModal = () => {
    setVisible(!visible);
  };

  return (
    <>
      <TouchableOpacity style={styles.buttonBox} onPress={showModal}>
        <View>
          <Repeat />
        </View>
        <Text style={styles.buttonText}>{t('changeStatus')}</Text>
      </TouchableOpacity>
      {visible && (
        <ChangeStatus
          currentStatus={status}
          observationId={observation._id}
          visible={visible}
          hideModal={showModal}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}

export default ChangeStatusButton;

const styles = StyleSheet.create({
  buttonBox: {
    alignSelf: 'flex-start',
    borderColor: '#EBEBEB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    gap: 8,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0A2540',
  },
});
