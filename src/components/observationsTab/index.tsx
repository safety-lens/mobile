import { View, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import ObservationsTabs from '../observationsTabs';

type IStatus = 'addressed' | 'inProgress' | 'notAddressed';

interface IObservationsTab {
  status: IStatus;
  counters: {
    addressedCount: number;
    inProgressCount: number;
    notAddressedCount: number;
  };
}

export default function ObservationsTab({ status, counters }: IObservationsTab) {
  return (
    <View style={styles.observationsTabs}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ObservationsTabs
          count={counters['addressedCount']}
          status={'addressed'}
          active={status as string}
        />
        <ObservationsTabs
          count={counters['inProgressCount']}
          status={'inProgress'}
          active={status as string}
        />
        <ObservationsTabs
          count={counters['notAddressedCount']}
          status={'notAddressed'}
          active={status as string}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  observationsTabs: {
    flexDirection: 'row',
  },
});
