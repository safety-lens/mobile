import { Colors } from '@/constants/Colors';
import { Observation } from '@/types/observation';
import { dateFormat } from '@/utils/dateFormat';
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import ObservationAction from '../observationAction';

interface IMyObservationCard {
  observation: Observation;
  isActions?: boolean;
  onRenamePress?: () => void;
  onEditCommentPress?: () => void;
  onChangeStatusPress?: () => void;
  onChangeDeadlinePress?: () => void;
  onChangeAssigneePress?: () => void;
  onChangeCategoriesPress?: () => void;
  onRemovePress?: () => void;
}

const PADDING = 16;
const LINE_HEIGHT = 20;
const GAP = 4;

export const APPROX_ITEM_HEIGHT = PADDING * 2 + LINE_HEIGHT * 2 + GAP;

export default function MyObservationCard({
  observation,
  isActions = true,
}: IMyObservationCard) {
  if (!observation) return;
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.observationId}>{observation.name || 'not found'}</Text>
        <Text style={styles.createdAt}>{dateFormat(observation.createdAt)}</Text>
      </View>
      {isActions && <ObservationAction observation={observation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#D0D5DD',
    backgroundColor: '#F3F4F5',
  },
  wrapper: {
    gap: GAP,
  },
  observationId: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
    color: Colors.light.text,
  },
  createdAt: {
    color: '#6D7176',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
  },
});
