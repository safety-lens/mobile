import { useApiNotifications, NotificationItem } from '@/axios/api/notification';
import React, { createContext, useState } from 'react';
import { useSubscription } from '../SubscriptionProvider';

export const NotificationContext = createContext<{
  unreadNotifications: number;
  onNotificationsAsRead: () => void;
}>({
  unreadNotifications: 0,
  onNotificationsAsRead: () => {},
});

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const { getNotifications } = useApiNotifications();
  const { hasSubscription } = useSubscription();

  const onNotificationsAsRead = async () => {
    if (!hasSubscription) {
      setUnreadNotifications(0);
      return;
    }
    const notifications = await getNotifications();
    const allUnreadNotifications = notifications.notifications.filter(
      (notification: NotificationItem) => !notification.isViewed
    );
    setUnreadNotifications(
      allUnreadNotifications.length > 0 ? allUnreadNotifications.length : undefined
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadNotifications,
        onNotificationsAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
