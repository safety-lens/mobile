import React, { useContext, useEffect } from 'react';
import 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Tabs, router } from 'expo-router';
import PlusIcon from '../../assets/svgs/plus';
import { UserIcon } from '../../assets/svgs/userIcon';
import { ProjectsProvider } from '@/context/projectsProvider';
import { ObservationsProvider } from '@/context/observationProvider';
import MapIcon from '../../assets/svgs/map';
import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useApiNotifications } from '@/axios/api/notification';
import { NotificationContext } from '@/context/NotificationProvider';
import ChatIcon from '../../assets/svgs/chat';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  console.log(errorMessage);
  throw new Error(errorMessage);
}

const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError(
        'Permission not granted to get push token for push notification!'
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
};

export default function RootLayout() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const { unreadNotifications, onNotificationsAsRead } = useContext(NotificationContext);

  const { saveUserPushToken } = useApiNotifications();

  useEffect(() => {
    onNotificationsAsRead();

    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          saveUserPushToken({
            deviceId: `${Device.deviceName}${Device.osBuildId}`.replace(
              /[^a-zA-Z0-9]/g,
              ''
            ),
            token: token,
          });
        }
      })
      .catch((error: unknown) => {
        console.log(`registerForPushNotificationsAsync ${error}`);
      });

    const responseListener = Notifications.addNotificationResponseReceivedListener(() => {
      router.push('/auth/myProfile/notification');
    });

    const getInitialNotification = async () => {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (response) {
        router.push('/auth/myProfile/notification');
      }
    };

    const notificationListener = Notifications.addNotificationReceivedListener(() => {
      onNotificationsAsRead();
    });

    getInitialNotification();

    return () => {
      if (responseListener) {
        Notifications.removeNotificationSubscription(responseListener);
      }
      if (notificationListener) {
        Notifications.removeNotificationSubscription(notificationListener);
      }
    };
  }, []);

  return (
    <ProjectsProvider>
      <ObservationsProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarLabel: ({ focused, children }) => (
              <Text
                style={[
                  { color: focused ? '#fff' : '#C9D2DB' },
                  styles.title,
                  isTablet && styles.titleTablet,
                ]}
              >
                {children}
              </Text>
            ),
            tabBarStyle: {
              backgroundColor: '#022140',
              height: Platform.OS === 'ios' ? 90 : 80,
              borderColor: 'transparent',
            },
            tabBarItemStyle: {
              top: isTablet ? 0 : 5,
            },
          }}
        >
          <Tabs.Screen
            name="projects"
            options={{
              title: t('home'),
              tabBarIcon: ({ focused }) => (
                <View style={focused && styles.activeBox}>
                  <MapIcon fill={'white'} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="chat"
            options={{
              title: t('chat'),
              tabBarIcon: ({ focused }) => (
                <View style={focused && styles.activeBox}>
                  <ChatIcon fill={'white'} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="safetyObservation"
            options={{
              title: t('observation'),
              tabBarIcon: ({ focused }) => (
                <View style={focused && styles.activeBox}>
                  <PlusIcon fill={'#022140'} background={'yellow'} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="myProfile"
            options={{
              title: t('profile'),
              tabBarBadge: unreadNotifications
                ? unreadNotifications > 9
                  ? '9+'
                  : unreadNotifications
                : undefined,
              tabBarBadgeStyle: {
                top: -10,
                left: 15,
                width: 26,
                height: 26,
                borderRadius: 16,
                paddingTop: 4,
                position: 'absolute',
              },
              tabBarIcon: ({ focused }) => (
                <View style={focused && styles.activeBox}>
                  <UserIcon />
                </View>
              ),
            }}
          />
        </Tabs>
      </ObservationsProvider>
    </ProjectsProvider>
  );
}

const styles = StyleSheet.create({
  activeBox: {
    backgroundColor: '#4D6F92',
    width: 64,
    height: 37,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  title: {
    top: 10,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 15,
    textAlign: 'center',
  },
  titleTablet: {
    position: 'absolute',
    top: 60,
  },
});
