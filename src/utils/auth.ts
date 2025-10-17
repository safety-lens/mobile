import { setValueStorage } from '@/utils/storage';
import { router } from 'expo-router';
import { apiInstance } from '@/axios/instances';
import { processQueue, setIsRefreshing } from '@/axios/queue';

export const logout = async (redirectTo: string = '/') => {
  await setValueStorage('auth', '');
  if ((apiInstance as any).defaults?.headers?.common?.Authorization) {
    delete (apiInstance as any).defaults.headers.common.Authorization;
  }
  setIsRefreshing(false);
  processQueue(new Error('logout'), null);
  router.replace(redirectTo);
};
