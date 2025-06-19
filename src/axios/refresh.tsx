import { getValueStorage, setValueStorage } from '@/utils/storage';
import { apiPublicInstance } from '.';
import { router } from 'expo-router';

export const useRefreshTokenFn = async () => {
  try {
    console.log('apiInstance.interceptors.response');

    const auth = await getValueStorage('auth');
    const { refreshToken } = JSON.parse(auth || '');

    const response = await apiPublicInstance.post('/auth/refresh', {
      refreshToken,
    });

    console.log('interceptors refreshToken', response);

    const token = JSON.stringify(response?.data);
    const { accessToken } = JSON.parse(token);

    setValueStorage('auth', token);
    console.log('interceptors accessToken', accessToken);

    return Promise.resolve(accessToken);
  } catch (error) {
    await setValueStorage('auth', '');
    router.replace('/');
    return Promise.reject({ error });
  }
};
