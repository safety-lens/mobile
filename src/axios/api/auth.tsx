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
import { useSubscriptionActions } from '@/context/SubscriptionProvider';
import useGetUserInfo from '@/hooks/getUserInfo';

interface UseApiSignInReturn {
  signIn: (data: IDataSignIn) => Promise<void>;
  getAccounts: () => Promise<UserAccountData | undefined>;
  getLastVisitedProject: (data: string) => Promise<IProjectCart | void>;
  saveLastVisitedProject: (data: string) => Promise<void>;
  getForgotPassword: (data: IForgotPassword) => Promise<unknown>;
  logout: () => Promise<void>;
  checkEmail: (email: string) => Promise<{ available: boolean } | undefined>;
  sendRegistrationLink: (email: string) => Promise<unknown>;
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
  role: 'user' | 'admin';
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

export interface Subscription {
  productName: string;
  accountId: string;
  productId: string;
  stripeSubscriptionId: string;
  startDate: string;
  finishDate?: string;
  nextPaymentDate?: string;
  status:
    | 'trialing'
    | 'active'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'past_due'
    | 'unpaid';
  level: number; // 0 - canceled, 1, 2, 3 - active
}

export interface SubscriptionFeatures {
  projectsAndObservations: boolean;
  getNotifications: boolean;
  createNotifications: boolean;
  chatWithAi: boolean;
  report: boolean;
  teamInvitations: boolean;
}

export interface UserAccountData {
  user: User;
  account: Account;
  subscription: Subscription | null;
  subscriptionFeatures: SubscriptionFeatures | null;
}

export const useApiSignIn = (): UseApiSignInReturn => {
  const { setUser } = useAuth();
  const { deleteUserPushToken } = useApiNotifications();
  const { syncSubscriptionData } = useSubscriptionActions();
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
    } catch (e: any) {
      const message =
        e.response.data.message === `User doesn't exist or password is invalid`
          ? t('signInError')
          : e.response.data.message;
      handelError(message || 'error signIn');
      throw e.response.data.message;
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
    } catch (e: any) {
      console.log(e);
      handelError('Error Get Last Visited Project');
      throw e.response.data.message;
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
    } catch (e: any) {
      handelError(e.response.data.message || 'error lastVisitedProject');
      throw e.response.data.message;
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
        await setValueStorage('accounts', account);
        // TODO: replace async storage with some reactive alternative
        await syncSubscriptionData();
        return response.data;
      }
    } catch (e: any) {
      handelError(e.response.data.message || 'error getAccounts');
      throw e.response.data.message;
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
        return JSON.stringify(response.data);
      }
    } catch (e: any) {
      handelError(e.response.data.message || 'error getForgotPassword');
      throw e.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const checkEmail = async (
    email: string
  ): Promise<{ available: boolean } | undefined> => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<{ available: boolean }> = await apiPublicInstance({
        method: 'get',
        url: `/auth/check_email?email=${email}`,
      });
      if (response.data) {
        return response.data;
      }
    } catch (e: any) {
      handelError(e.response.data.message || 'error checkEmail');
      throw e.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const sendRegistrationLink = async (email: string): Promise<unknown> => {
    console.log('email', `/auth/finish_registration/${email}`);
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<unknown> = await apiPublicInstance({
        method: 'post',
        url: `/auth/finish_registration/`,
        data: { email },
      });
      if (response) {
        return response.status;
      }
    } catch (e: any) {
      console.log('error', e.response);
      handelError(e.response.data.message || 'error sendRegistrationLink');
      throw e.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await deleteUserPushToken(
      `${Device.deviceName}${Device.osBuildId}`.replace(/[^a-zA-Z0-9]/g, '')
    );
    await setValueStorage('auth', '');
    await setValueStorage('accounts', '');
    // TODO: replace async storage with some reactive alternative
    await syncSubscriptionData();
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
    checkEmail,
    sendRegistrationLink,
    isLoading,
    error,
  };
};
