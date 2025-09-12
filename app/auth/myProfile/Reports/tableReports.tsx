import { Observation } from '@/types/observation';
import { dateFormat, dateTimeFormat, fullDateTimeFormat } from '@/utils/dateFormat';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EditNoteModal from './EditNoteModal';
import Edit from '../../../../assets/svgs/edit';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';

export default function TableReports({
  reports,
  isLoading,
  projectLocation,
}: {
  reports: Observation[];
  isLoading?: boolean;
  projectLocation?: string;
}) {
  const { t } = useTranslation();
  const [editNoteModalVisible, setEditNoteModalVisible] = React.useState(false);
  const [defaultNote, setDefaultNote] = React.useState('');
  const [defaultObservationId, setDefaultObservationId] = React.useState('');

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <>
      <ScrollView horizontal>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, { borderLeftWidth: 0 }]}>
              {t('observationName')}
            </Text>
            <Text style={[styles.headerCell]}>{t('date')}</Text>
            <Text style={[styles.headerCell]}>{t('location')}</Text>
            <Text style={[styles.headerCell]}>{t('reporter')}</Text>
            <Text style={[styles.headerCell]}>{t('contractor')}</Text>
            <Text style={[styles.headerCell]}>{t('subContractor')}</Text>
            <Text style={[styles.headerCell]}>{t('categoryOfObservation')}</Text>
            <Text style={[styles.headerCell]}>{t('statusOfObservation')}</Text>
            <Text style={[styles.headerCell]}>{t('assignee')}</Text>
            <Text style={[styles.headerCell]}>{t('deadlineToComplete')}</Text>
            <Text style={[styles.headerCell]}>{t('closeDate')}</Text>
            <Text style={[styles.headerCell]}>{t('followUp')}</Text>
            <Text style={[styles.headerCell, { borderRightWidth: 0 }]}>
              {t('notesComments')}
            </Text>
          </View>
          <FlashList
            keyExtractor={(item) => item._id}
            estimatedItemSize={50}
            data={reports}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View key={item._id} style={styles.dataRow}>
                <Text style={[styles.dataCell, { borderRightWidth: 0 }]}>
                  {item.name}
                </Text>
                <Text style={[styles.dataCell]}>
                  {item.createdAt ? <>{fullDateTimeFormat(item.createdAt)}</> : '-'}
                </Text>
                <Text style={[styles.dataCell]}>{projectLocation}</Text>
                <Text style={[styles.dataCell]}>{item?.createdBy?.name || '-'}</Text>
                <Text style={[styles.dataCell]}>{item.contractor || '-'}</Text>
                <Text style={[styles.dataCell]}>{item.subContractor || '-'}</Text>
                <Text style={[styles.dataCell]}>
                  {item?.categories?.map((category) => category?.name).join(', ')}
                </Text>
                <Text style={[styles.dataCell]}>{item.status}</Text>
                <Text style={[styles.dataCell]}>
                  {item.assignees?.map((assignee) => assignee?.email).join(', ')}
                </Text>
                <Text style={[styles.dataCell]}>
                  {item.deadline ? (
                    <>
                      {dateFormat(item.deadline)}, {dateTimeFormat(item.deadline)}
                    </>
                  ) : (
                    '-'
                  )}
                </Text>
                <Text style={[styles.dataCell]}>
                  {item.closeDate ? (
                    <>
                      {dateFormat(item.closeDate)}, {dateTimeFormat(item.closeDate)}
                    </>
                  ) : (
                    '-'
                  )}
                </Text>
                <Text style={[styles.dataCell]}>{item.followUp || '-'}</Text>

                <View style={styles.editButtonContainer}>
                  <Text style={[styles.dataCellNote]}>
                    {item.note?.slice(0, 40)}
                    {item?.note?.length && item?.note?.length > 40 && '...'}
                  </Text>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                    }}
                    onPress={() => {
                      setDefaultNote(item.note || '');
                      setDefaultObservationId(item._id);
                      setEditNoteModalVisible(true);
                    }}
                  >
                    {!item.note?.length && (
                      <Text style={styles.editButtonText}>{t('Add Comment')}</Text>
                    )}
                    <View style={styles.editButton}>
                      <Edit width={16} height={16} fill="#007AFF" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>

      <EditNoteModal
        visible={editNoteModalVisible}
        hideModal={() => setEditNoteModalVisible(false)}
        defaultNote={defaultNote}
        key={defaultObservationId}
        observationId={defaultObservationId}
      />
    </>
  );
}

const styles = StyleSheet.create({
  table: {
    marginTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerCell: {
    fontWeight: 'bold',
    width: 180,
    marginLeft: 15,
    borderRightWidth: 1,
    borderColor: '#E0E0E0',
  },

  dataRow: {
    flexDirection: 'row',
    padding: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dataCell: {
    color: '#333',
    width: 180,
    marginLeft: 15,
  },
  dataCellNote: {
    maxWidth: 150,
  },
  editButton: {
    width: 16,
    borderBottomWidth: 1,
    borderColor: '#007AFF',
  },
  editButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editButtonText: {
    marginLeft: -8,
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '500',
  },
});
