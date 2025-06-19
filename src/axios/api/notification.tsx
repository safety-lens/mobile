/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { AxiosResponse } from 'axios';
import { apiInstance } from '..';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { ICreateNotification } from '@/components/CreateNotification';
// import * as Notifications from 'expo-notifications';

export interface NotificationItem {
  id: string;
  text: string;
  createdAt: Date;
  importance: 'critical' | 'standard';
  isShown: boolean;
  isViewed: boolean;
  type: string;
  updatedAt: Date;
  userId: string;
  projectId: {
    name?: string;
  };
}

/**
 * Represents the API response for notifications
 */
export interface NotificationApiResponse {
  count: number;
  notifications: NotificationItem[];
  page: number;
  pageSize: number;
}

interface ISaveUserPushToken {
  deviceId: string;
  token: string;
}

interface UseApiSignInReturn {
  getNotifications: () => Promise<any | void>;
  sendNotifications: (data: ICreateNotification) => Promise<any | void>;
  saveUserPushToken: (data: ISaveUserPushToken) => Promise<any | void>;
  deleteUserPushToken: (data: string) => Promise<any | void>;
  markAllNotificationsViewed: () => Promise<any | void>;
  isLoading: boolean;
  error: string | null;
}

export const useApiNotifications = (): UseApiSignInReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();

  const showToast = (errorText: string) => {
    Toast.show({
      type: 'error',
      text1: t('error'),
      text2: errorText || 'Some error, try again',
    });
  };

  const handelError = (text: string) => {
    setError(text);
    showToast(text);
    console.error(text);
  };
  const getNotifications = async (): Promise<NotificationApiResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<NotificationApiResponse> = await apiInstance({
        method: 'get',
        url: '/notifications?page=1&pageSize=100',
      });

      if (response.data) {
        return response.data;
      } else {
        throw new Error('No data in response');
      }
    } catch (error: any) {
      console.log(error);
      handelError(error.response.data.message || 'error uploads');
      throw error; // Throwing the error to handle it in the calling code
    } finally {
      setIsLoading(false);
    }
  };

  const sendNotifications = async (
    data: ICreateNotification
  ): Promise<NotificationApiResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<NotificationApiResponse> = await apiInstance({
        method: 'post',
        url: '/notifications',
        data,
      });

      if (response.data) {
        return response.data;
      } else {
        throw new Error('No data in response');
      }
    } catch (error: any) {
      console.log(error);
      handelError(error.response.data.message || 'error uploads');
      throw error; // Throwing the error to handle it in the calling code
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserPushToken = async (data: ISaveUserPushToken): Promise<unknown> => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<ISaveUserPushToken> = await apiInstance({
        method: 'post',
        url: '/users/push-notifications',
        data,
      });

      if (response.data) {
        return response.data;
      } else {
        throw new Error('No data in response');
      }
    } catch (error: any) {
      console.log(error);
      handelError(error.response.data.message || 'error uploads');
      throw error; // Throwing the error to handle it in the calling code
    } finally {
      setIsLoading(false);
    }
  };

  const markAllNotificationsViewed = async (): Promise<unknown> => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<ISaveUserPushToken> = await apiInstance({
        method: 'PATCH',
        url: '/notifications/read_all',
      });

      if (response.data) {
        return response.data;
      } else {
        throw new Error('No data in response');
      }
    } catch (error: any) {
      console.log(error);
      handelError(error.response.data.message || 'error uploads');
      throw error; // Throwing the error to handle it in the calling code
    } finally {
      setIsLoading(false);
      // TODO: Uncomment this when we have a way to handle notifications

      // await Notifications.setBadgeCountAsync(0);
      // await Notifications.dismissAllNotificationsAsync();
    }
  };

  const deleteUserPushToken = async (data: string): Promise<unknown> => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<NotificationApiResponse> = await apiInstance({
        method: 'delete',
        url: '/users/push-notifications',
        data: {
          deviceId: data,
        },
      });

      if (response.data) {
        return response.data;
      } else {
        throw new Error('No data in response');
      }
    } catch (error: any) {
      console.log(error);
      handelError(error.response.data.message || 'error uploads');
      throw error; // Throwing the error to handle it in the calling code
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getNotifications,
    sendNotifications,
    saveUserPushToken,
    deleteUserPushToken,
    markAllNotificationsViewed,
    isLoading,
    error,
  };
};
