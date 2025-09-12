import React, { useContext, useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerItem } from '@react-navigation/drawer';
import { router } from 'expo-router';

import LogOutIcon from '../../../assets/svgs/logOut';

import { useApiSignIn } from '@/axios/api/auth';
import useGetUserInfo from '@/hooks/getUserInfo';
import { useTranslation } from 'react-i18next';
import SLLogo from '../../../assets/svgs/SLlogo';
import LanguageSelect from '@/components/languageSelect';
import Notification from '../../../assets/svgs/notification';
import { NotificationContext } from '@/context/NotificationProvider';
import { apiInstance } from '@/axios';
import ReportIcon from '../../../assets/svgs/reportIcon';

export default function MyProfile() {
  const { logout } = useApiSignIn();
  const { user, refreshUserInfo } = useGetUserInfo();
  const { t } = useTranslation();
  const { unreadNotifications } = useContext(NotificationContext);
  const { isAdmin } = useGetUserInfo();

  const isStaging = apiInstance.defaults.baseURL?.includes('staging');

  const isDevBuild = __DEV__;
  const isLocalBuild = apiInstance.defaults.baseURL?.includes('localhost');
  const isProductionBuild = !isDevBuild && !isLocalBuild && !isStaging;

  useEffect(() => {
    console.log('Build type:', {
      isDev: isDevBuild,
      isLocal: isLocalBuild,
      isStaging: isStaging,
      isProduction: isProductionBuild,
    });
  }, []);

  const goToObservations = () => {
    router.navigate('/auth/myProfile/notification');
  };

  const goToReports = () => {
    router.navigate('/auth/myProfile/Reports');
  };

  useEffect(() => {
    if (refreshUserInfo) refreshUserInfo();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bottomBlock}>
        <View style={{ marginTop: '50%' }}>
          {isStaging && <Text style={styles.userBlockText}>{'Stage version: 102'}</Text>}
          <View style={styles.userBlock}>
            <View style={styles.logoBox}>
              <SLLogo />
            </View>
            <View style={styles.userTextBlock}>
              <Text style={styles.userBlockText}>{user?.user?.name}</Text>
              <Text style={[styles.userBlockText, { color: '#C9D2DB' }]}>
                {user?.user?.email}
              </Text>
            </View>
          </View>
          <View style={styles.languageBlock}>
            <LanguageSelect />
          </View>
          <View style={styles.languageBlock}>
            <TouchableOpacity style={styles.notification} onPress={goToObservations}>
              {unreadNotifications > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </Text>
                </View>
              )}
              <Notification fill="white" />
              <Text style={styles.drawerItem}>{t('notification')}</Text>
            </TouchableOpacity>

            {isAdmin && (
              <TouchableOpacity style={styles.reports} onPress={goToReports}>
                <ReportIcon />
                <Text style={styles.drawerItem}>{t('Reports')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <DrawerItem
          labelStyle={styles.drawerItem}
          label={t('logout')}
          onPress={() => logout()}
          icon={() => <LogOutIcon />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022140',
  },
  topBlock: {
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 35,
    marginVertical: 4,
  },
  close: {
    marginBottom: -10,
    padding: 10,
    alignSelf: 'flex-end',
  },
  bottomBlock: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 75,
  },
  languageBlock: {
    marginHorizontal: 18,
    marginBottom: 18,
  },
  userBlock: {
    marginTop: 18,
    marginHorizontal: 18,
    marginBottom: 18,
    flexDirection: 'row',
  },
  userTextBlock: {
    gap: 8,
    marginLeft: 16,
  },
  userBlockText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 500,
  },
  drawerItem: {
    color: 'white',
    fontSize: 16,
    fontWeight: 500,
  },
  logoBox: { backgroundColor: 'white', borderRadius: 8, padding: 4 },
  notification: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  reports: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 15,
    zIndex: 1,
    position: 'absolute',
    left: 10,
    top: -5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
