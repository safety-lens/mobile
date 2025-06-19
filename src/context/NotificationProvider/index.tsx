import { useApiNotifications, NotificationItem } from '@/axios/api/notification';
import React, { createContext, useState } from 'react';

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

  const onNotificationsAsRead = async () => {
    const notifications = await getNotifications();
    const unreadNotifications = notifications.notifications.filter(
      (notification: NotificationItem) => !notification.isViewed
    );
    setUnreadNotifications(
      unreadNotifications.length > 0 ? unreadNotifications.length : undefined
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
