import { getValueStorage, setValueStorage } from '@/utils/storage';
import { apiPublicInstance } from './instances';

export const refreshAccessToken = async () => {
  try {
    const auth = await getValueStorage('auth');
    const { refreshToken } = JSON.parse(auth || '');

    const response = await apiPublicInstance.post('/auth/refresh', {
      refreshToken,
    });

    const token = JSON.stringify(response?.data);
    const { accessToken } = JSON.parse(token);

    await setValueStorage('auth', token);

    return accessToken;
  } catch (error) {
    return Promise.reject(error);
  }
};
