/* eslint-disable @typescript-eslint/no-explicit-any */
import { setValueStorage } from '@/utils/storage';
import { apiInstance, apiPublicInstance } from '..';
import { useAuth } from '@/context/AuthProvider';
import { router } from 'expo-router';
import { IDataSignIn } from '@/components/signInForm';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { IProjectCart } from '@/types/project';
import { useApiNotifications } from './notification';
import * as Device from 'expo-device';

interface UseApiSignInReturn {
  signIn: (data: IDataSignIn) => Promise<void>;
  getAccounts: () => Promise<UserAccountData | undefined>;
  getLastVisitedProject: (data: string) => Promise<IProjectCart | void>;
  saveLastVisitedProject: (data: string) => Promise<void>;
  getForgotPassword: (data: IForgotPassword) => Promise<unknown>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}
interface ApiResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
  id: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  accountRole: 'user' | 'admin';
}

export interface UserList {
  id: string;
  name: string;
  email: string;
}

interface Account {
  id: string;
  name: string;
  status: string;
  plan: string;
  billingCycle: string;
  planStartedAt: string;
}

interface IForgotPassword {
  password?: string;
  code?: string;
  email?: string;
  isInvitation?: boolean;
}

export interface UserAccountData {
  user: User;
  account: Account;
}

export const useApiSignIn = (): UseApiSignInReturn => {
  const { setUser } = useAuth();
  const { deleteUserPushToken } = useApiNotifications();
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

  const signIn = async (data: IDataSignIn): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AxiosResponse<ApiResponse> = await apiPublicInstance({
        method: 'post',
        url: '/auth/signin',
        data,
      });

      if (response.data) {
        setUser({ auth: response.data });
        const token = JSON.stringify(response.data);
        await setValueStorage('auth', token);
      }
    } catch (error: any) {
      const message =
        error.response.data.message === `User doesn't exist or password is invalid`
          ? t('signInError')
          : error.response.data.message;
      handelError(message || 'error signIn');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const getLastVisitedProject = async (userId: string): Promise<IProjectCart | void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AxiosResponse<IProjectCart> = await apiInstance({
        method: 'get',
        url: `/projects/last_opened_by/${userId}`,
      });
      if (response.data) {
        return response.data;
      }
    } catch (error: any) {
      console.log(error);
      handelError('Error Get Last Visited Project');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const saveLastVisitedProject = async (projectId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AxiosResponse<unknown> = await apiInstance({
        method: 'patch',
        url: `/projects/last_opened_by/${projectId}`,
      });
      if (response.data) {
        console.log('lastVisitedProject', response.data);
      }
    } catch (error: any) {
      handelError(error.response.data.message || 'error lastVisitedProject');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const getAccounts = async (): Promise<UserAccountData | undefined> => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<UserAccountData> = await apiInstance({
        method: 'get',
        url: '/accounts',
      });

      if (response.data) {
        const account = JSON.stringify(response.data);
        setValueStorage('accounts', account);
        console.log('getAccounts', response.data);
        return response.data;
      }
    } catch (error: any) {
      handelError(error.response.data.message || 'error getAccounts');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const getForgotPassword = async (data: IForgotPassword): Promise<unknown> => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<unknown> = await apiPublicInstance({
        method: 'post',
        url: '/auth/reset-password',
        data,
      });
      if (response.data) {
        const data = JSON.stringify(response.data);
        return data;
      }
    } catch (error: any) {
      handelError(error.response.data.message || 'error getAccounts');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await deleteUserPushToken(`${Device.deviceName}${Device.osBuildId}`);
    await setValueStorage('auth', '');
    await setValueStorage('accounts', '');
    setUser(null);
    router.replace('/');
  };

  return {
    logout,
    signIn,
    getAccounts,
    getLastVisitedProject,
    saveLastVisitedProject,
    getForgotPassword,
    isLoading,
    error,
  };
};
