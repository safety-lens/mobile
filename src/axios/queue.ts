import { apiInstance } from './instances';

interface QueuedRequest {
  resolve: (value: any) => void;
  reject: (error: any) => void;
  config: any;
}

let isRefreshing = false;
let requestQueue: QueuedRequest[] = [];

export const getIsRefreshing = () => isRefreshing;
export const setIsRefreshing = (value: boolean) => {
  isRefreshing = value;
};

export const enqueueRequest = (config: any) =>
  new Promise((resolve, reject) => {
    requestQueue.push({ resolve, reject, config });
  });

export const processQueue = (error: any, token: string | null = null) => {
  requestQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      resolve(apiInstance(config));
    }
  });

  requestQueue = [];
};
