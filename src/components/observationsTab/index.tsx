import { View, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import ObservationsTabs from '../observationsTabs';

type IStatus = 'addressed' | 'inProgress' | 'notAddressed';

interface IObservationsTab {
  status: IStatus;
}

export default function ObservationsTab({ status }: IObservationsTab) {
  return (
    <View style={styles.observationsTabs}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ObservationsTabs status={'addressed'} active={status as string} />
        <ObservationsTabs status={'inProgress'} active={status as string} />
        <ObservationsTabs status={'notAddressed'} active={status as string} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  observationsTabs: {
    flexDirection: 'row',
  },
});
