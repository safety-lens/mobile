 
import { apiInstance } from '..';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { ProjectStatus } from '@/types/project';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { UserList } from './auth';

export interface IGetAllProject {
  userId?: string;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  rowsPerPage?: number;
  status?: ProjectStatus;
  projectNumber?: string;
}

export interface GetAllCompanies {
  id: string;
  name: string;
}

interface UseApiSignInReturn {
  getUsersNameEmailList: (projectId?: string) => Promise<UserList[]>;
  isLoading: boolean;
  error: string | null;
}

export const useApiUser = (): UseApiSignInReturn => {
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

  const getUsersNameEmailList = async (projectId?: string): Promise<UserList[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AxiosResponse<UserList[]> = await apiInstance({
        method: 'get',
        url: '/users/members',
        params: {
          projectId: projectId,
        },
      });

      return response.data;
    } catch (error: any) {
      handelError(error.response.data.message || 'Fetch error users/members');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getUsersNameEmailList,
    isLoading,
    error,
  };
};
