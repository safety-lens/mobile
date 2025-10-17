import { setValueStorage } from '@/utils/storage';
import { router } from 'expo-router';
import { apiInstance } from '@/axios/instances';
import { processQueue, setIsRefreshing } from '@/axios/queue';

const clearApiHeaders = () => {
  if (apiInstance.defaults?.headers?.common?.Authorization) {
    delete apiInstance.defaults.headers.common.Authorization;
  }
};

export const logout = async () => {
  await setValueStorage('auth', '');
  await setValueStorage('accounts', '');

  clearApiHeaders();
  setIsRefreshing(false);
  processQueue(new Error('logout'), null);
  router.replace('/');
};
