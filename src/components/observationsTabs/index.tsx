import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { statusTitleText } from '@/utils/statusTitle';
import { useObservations } from '@/context/observationProvider';
import { useTranslation } from 'react-i18next';
import { IStatus } from '@/types/observation';

interface IObservationStatusCard {
  status: IStatus;
  active: string;
}

export default function ObservationsTabs({
  status = 'notAddressed',
  active,
}: IObservationStatusCard) {
  const { singleObservation } = useObservations();
  const { t } = useTranslation();

  const push = () => {
    router.push({
      pathname: '/auth/projects/[observations]',
      params: { observations: status },
    });
  };

  const activeTab = active === status && styles.border;

  return (
    <TouchableOpacity onPress={push} style={[styles.cardBox, activeTab]}>
      <View style={styles.statusBox}>
        <View style={[styles.statusDot, styles[status]]} />
        <Text style={styles.statusString}>{statusTitleText(t)[status]}</Text>
        <Text style={styles.statusNumber}>{singleObservation?.[`${status}Count`]}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardBox: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
  },
  statusBox: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 100,
  },
  statusNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.gray,
  },
  statusString: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 17,
    color: Colors.light.text,
  },
  border: {
    borderColor: '#EBEBEB',
    borderWidth: 1,
    backgroundColor: 'white',
  },

  addressed: {
    backgroundColor: '#2C875D',
  },
  inProgress: {
    backgroundColor: '#FFBF00',
  },
  notAddressed: {
    backgroundColor: '#FF0D31',
  },
});
