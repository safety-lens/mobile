import axios, { AxiosResponse } from 'axios';
import { getValueStorage } from '@/utils/storage';
import { useRefreshTokenFn } from './refresh';
import { API_URL } from '@/constants/api';

export const apiPublicInstance = axios.create({
  baseURL: API_URL,
});

export const apiInstance = axios.create({
  // baseURL: 'https://api.safetylens.ai',
  baseURL: API_URL,
});

apiInstance.interceptors.request.use(
   
  async (config: any) => {
    const auth = await getValueStorage('auth');
    const { accessToken } = JSON.parse(auth || '');
    console.log('accessToken', accessToken);
    if (accessToken) {
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${accessToken}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const config = error?.config;
    if (error.response?.status === 401 && !config._retry) {
      config._retry = true;

      const accessToken = await useRefreshTokenFn();
      console.log('accessToken after refresh in interceptor', accessToken);

      if (accessToken) {
        const header = `Bearer ${accessToken}`;
        apiInstance.defaults.headers.common.Authorization = header;
        config.headers.Authorization = header;
      }
    }

    return Promise.reject(error);
  }
);
