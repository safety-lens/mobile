import { Colors } from '@/constants/Colors';
import { useObservations } from '@/context/observationProvider';
import { IStatus } from '@/types/observation';
import { statusTitleText } from '@/utils/statusTitle';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface IObservationStatusCard {
  number: number;
  status: IStatus;
  id: string;
}

export default function ObservationStatusCard({
  number = 0,
  status = 'notAddressed',
  id,
}: IObservationStatusCard) {
  const { t } = useTranslation();
  const { setSingleObservation } = useObservations();

  const push = () => {
    setSingleObservation(null);
    router.push({
      pathname: `/auth/projects/(observations)/[observations]`,
      params: { observations: status, number, id },
    });
  };

  return (
    <View style={[styles.cardBox, styles.border]}>
      <View style={styles.statusWrapper}>
        <View style={styles.statusBox}>
          <View style={[styles.statusDot, styles[status]]} />
          <Text style={styles.statusNumber}>{number}</Text>
        </View>
        <Text style={styles.statusString}>{statusTitleText(t)[status]}</Text>
      </View>
      <TouchableOpacity onPress={push} style={[styles.border, styles.viewDetails]}>
        <Text style={styles.viewDetailsString}>{t('viewDetails')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  statusBox: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 100,
  },
  statusNumber: {
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 25.92,
    color: Colors.light.text,
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
  },
  cardBox: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewDetails: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  viewDetailsString: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 15,
    color: Colors.light.text,
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
