import { AxiosResponse } from 'axios';
import { apiInstance } from './instances';
import { getValueStorage } from '@/utils/storage';
import { refreshAccessToken } from './refresh';
import { router } from 'expo-router';
import { enqueueRequest, getIsRefreshing, processQueue, setIsRefreshing } from './queue';
import { logout } from '@/axios/utils';

export const requestInterceptor = async (config: any) => {
  if (config.headers?.Authorization) {
    return config;
  }
  const auth = await getValueStorage('auth');
  if (auth) {
    try {
      const { accessToken } = JSON.parse(auth);
      if (accessToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        };
      }
    } catch {
      // ignore parse error, request proceeds without auth header
    }
  }
  return config;
};

export const responseErrorInterceptor = async (error: any) => {
  const config = error?.config || {};
  const statusCode = error?.response?.status;

  if (statusCode === 401 && !config._retry) {
    config._retry = true;

    if (getIsRefreshing()) {
      return enqueueRequest(config);
    }

    setIsRefreshing(true);
    try {
      const accessToken = await refreshAccessToken();
      if (accessToken) {
        const header = `Bearer ${accessToken}`;
        apiInstance.defaults.headers.common.Authorization = header;
        config.headers = config.headers || {};
        config.headers.Authorization = header;
        processQueue(null, accessToken);
        return apiInstance.request(config);
      } else {
        processQueue(error, null);
        await logout();
        return Promise.reject(error);
      }
    } catch (refreshError) {
      processQueue(refreshError, null);
      await logout();
      return Promise.reject(refreshError);
    } finally {
      setIsRefreshing(false);
    }
  }

  if (statusCode === 403) {
    router.replace('/auth/projects');
  }
  return Promise.reject(error);
};

export const attachInterceptors = () => {
  apiInstance.interceptors.request.use(requestInterceptor, (error) =>
    Promise.reject(error)
  );
  apiInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    responseErrorInterceptor
  );
};
