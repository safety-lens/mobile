import { Text, View, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import ScreenLayout from '@/components/screenLayout';
import ScreenTopNav from '@/components/screenTopNav';

import { useTranslation } from 'react-i18next';
import { NotificationItem, useApiNotifications } from '@/axios/api/notification';
import { dateFormat } from '@/utils/dateFormat';
import CreateNotification from '@/components/CreateNotification';
import useGetUserInfo from '@/hooks/getUserInfo';
import { RefreshControl } from 'react-native-gesture-handler';
import { NotificationContext } from '@/context/NotificationProvider';

export default function Notification() {
  const { getNotifications, markAllNotificationsViewed } = useApiNotifications();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { onNotificationsAsRead } = useContext(NotificationContext);

  const { isAdmin } = useGetUserInfo();

  const { t } = useTranslation();

  const getUserNotifications = async () => {
    await markAllNotificationsViewed();
    onNotificationsAsRead();
    const notifications = await getNotifications();
    setNotifications(notifications.notifications);
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'critical':
        return styles.highPriority;
      case 'standard':
        return styles.standardPriority;
      default:
        return {};
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const notifications = await getNotifications();
    setNotifications(notifications.notifications);
    setRefreshing(false);
  };

  useEffect(() => {
    getUserNotifications();
  }, []);

  return (
    <ScreenLayout>
      <View style={{ marginBottom: 10 }}>
        <ScreenTopNav title={t('notification')} backPath="/auth/myProfile" />
      </View>
      {isAdmin && (
        <View>
          <CreateNotification onSended={getUserNotifications} />
        </View>
      )}
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, styles.headerCellFirst]}>
            {t('notification')}
          </Text>
          <Text style={[styles.headerCell, styles.headerCellOther]}>{t('date')}</Text>
          <Text style={[styles.headerCell, styles.headerCellOther]}>{t('priority')}</Text>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {notifications?.map((item: NotificationItem) => (
            <View key={item.id} style={styles.dataRow}>
              <Text style={[styles.dataCell, styles.dataCellFirst]}>{item.text}</Text>
              <Text style={[styles.dataCell, styles.dataCellOther]}>
                {dateFormat(item.createdAt)}
              </Text>
              <Text
                style={[
                  styles.dataCell,
                  styles.dataCellOther,
                  getPriorityStyle(item.importance),
                ]}
              >
                {t(item.importance)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  table: {
    marginTop: 10,
    marginBottom: 120,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    paddingVertical: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerCellFirst: {
    flex: 2,
  },
  headerCellOther: {
    flex: 1,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dataCell: {
    paddingVertical: 10,
    textAlign: 'center',
  },
  dataCellFirst: {
    flex: 2,
  },
  dataCellOther: {
    flex: 1,
  },
  highPriority: {
    color: '#dc3545',
  },
  standardPriority: {
    color: '#0077FF',
  },
});
