 
import { useState } from 'react';
import { AxiosResponse } from 'axios';
import { apiInstance } from '..';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

export interface Conversation {
  _id: string;
  accountId: string;
  agentId: string;
  unread: boolean;
  messages: any[];
  analytics: {
    missingData: any[];
    feedback: any[];
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  s3Uri: string;
  url: string;
}

export interface GetConversationListResponse {
  conversations: Conversation[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface GetConversationList {
  page: number;
  pageSize: number;
}

interface UseApiSignInReturn {
  getConversationList: (
    data: GetConversationList
  ) => Promise<GetConversationListResponse | undefined>;
  getConversationById: (data: { id: string }) => Promise<ApiResponse | void>;
  isLoading: boolean;
  error: string | null;
}

export const useApiConversation = (): UseApiSignInReturn => {
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

  const getConversationList = async ({
    pageSize,
    page,
  }: GetConversationList): Promise<GetConversationListResponse | undefined> => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<GetConversationListResponse> = await apiInstance({
        method: 'get',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        url: '/conversations',
        params: {
          pageSize,
          page,
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

  const getConversationById = async ({ id }: { id: string }): Promise<ApiResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<ApiResponse> = await apiInstance({
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        url: `/conversations`,
        params: {
          id,
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
    getConversationList,
    getConversationById,
    isLoading,
    error,
  };
};
