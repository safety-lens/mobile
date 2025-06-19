import { Colors } from '@/constants/Colors';
import { Observation } from '@/types/observation';
import { dateFormat } from '@/utils/dateFormat';
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import ObservationAction from '../observationAction';

interface IMyObservationCard {
  observation: Observation;
  isActions?: boolean;
}

export default function MyObservationCard({
  observation,
  isActions = true,
}: IMyObservationCard) {
  if (!observation) return;
  return (
    <View style={styles.observationBox}>
      <View>
        <Text style={styles.observationId}>{observation.name || 'not found'}</Text>
        <Text style={styles.createdAt}>{dateFormat(observation.createdAt)}</Text>
      </View>
      {isActions && <ObservationAction observation={observation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  observationBox: {
    gap: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#D0D5DD',
    backgroundColor: '#F3F4F5',
  },
  observationId: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  createdAt: {
    color: '#6D7176',
    fontSize: 16,
    fontWeight: '500',
  },
  dots: {
    fontWeight: '900',
    fontSize: 30,
    marginTop: -18,
    color: Colors.light.text,
  },
});
