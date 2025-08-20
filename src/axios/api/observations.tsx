/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiInstance } from '..';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { IProjectCart } from '@/types/project';
import { ObservationsResponse, StatusTitle } from '@/types/observation';
import { useObservations } from '@/context/observationProvider';
import Toast from 'react-native-toast-message';
import { IStartChat, ChatResponse, IConversationIdResponse } from '@/types/chatTypes';
import { useTranslation } from 'react-i18next';

interface ICreateObservation {
  name: string;
  projectId: string;
  photoList: string[];
  x: number;
  y: number;
  text: string;
  conversationId: string;
  locationComment?: string;
  categories?: string[];
  deadline?: Date;
  assignees?: string[];
}
interface IGetAllObservations {
  projectId?: string;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  rowsPerPage?: number;
  status?: string;
  startPeriod?: Date | undefined;
  finishPeriod?: Date | undefined;
}

interface IRemoveObservation {
  observationId: string;
}
interface IUpdateObservation {
  observationId: string;
  data: {
    implementedActions?: string;
    status?: StatusTitle;
    name?: string;
    locationComment?: string;
    deadline?: Date;
    assignees?: string[];
    note?: string;
  };
}

export interface IGetAllCategory {
  links: string[];
  name: string;
  specification: string;
}

interface IGetConversationId {
  id?: string;
  accountId: string;
}

interface UseApiSignInReturn {
  createObservation: (data: ICreateObservation) => Promise<void>;
  getAllObservations: (data: IGetAllObservations) => Promise<ObservationsResponse | void>;
  getFilterObservations: (
    data: IGetAllObservations
  ) => Promise<ObservationsResponse | void>;
  deleteObservation: (data: IRemoveObservation) => Promise<void>;
  updateObservations: (data: IUpdateObservation) => Promise<IProjectCart | void>;
  startChat: (data: IStartChat) => Promise<ChatResponse | undefined>;
  getConversationId: (
    data: IGetConversationId
  ) => Promise<IConversationIdResponse | undefined>;
  getChat: (id: string) => Promise<ChatResponse | void>;
  getAllCategory: () => Promise<IGetAllCategory[] | void>;
  reportShare: (data: {
    comment: string;
    email: string;
    format: string;
    s3Uri: string;
  }) => Promise<ChatResponse | void>;
  isLoading: boolean;
  error: string | null;
}

export const useApiObservations = (): UseApiSignInReturn => {
  const { currentObservationPage, setObservation, setSingleObservation } =
    useObservations();

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

  const createObservation = async (data: ICreateObservation): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AxiosResponse<ICreateObservation> = await apiInstance({
        method: 'post',
        url: '/observations',
        data,
      });
      if (response.data) {
        console.log('createObservation', response.data);
      }
    } catch (error: any) {
      handelError(error.response.data.message || 'error createObservation');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllObservations = async ({
    projectId,
    sortBy = 'createdAt',
    status,
    startPeriod,
    finishPeriod,
    sortDirection = 'desc',
    page,
    rowsPerPage = 6,
  }: IGetAllObservations): Promise<ObservationsResponse | void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<ObservationsResponse> = await apiInstance({
        method: 'get',
        url: '/observations',
        params: {
          projectId,
          sortBy,
          status,
          sortDirection,
          page: page || currentObservationPage,
          rowsPerPage,
          startPeriod,
          finishPeriod,
        },
      });

      if (response.data) {
        setObservation(response.data);
      }
    } catch (error: any) {
      handelError(error.response.data.message || 'Fetch error observations');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const getFilterObservations = async ({
    projectId,
    sortBy = 'createdAt',
    status,
    startPeriod,
    finishPeriod,
    sortDirection = 'desc',
    // page = 1,
    rowsPerPage = 100,
  }: IGetAllObservations): Promise<ObservationsResponse | void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<ObservationsResponse> = await apiInstance({
        method: 'get',
        url: '/observations',
        params: {
          projectId,
          sortBy,
          status,
          sortDirection,
          page: currentObservationPage,
          rowsPerPage,
          startPeriod,
          finishPeriod,
        },
      });

      if (response.data) {
        setSingleObservation(response.data);
      }
    } catch (error: any) {
      handelError(error.response.data.message || 'error getFilterObservations');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteObservation = async ({
    observationId,
  }: IRemoveObservation): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AxiosResponse<IRemoveObservation> = await apiInstance({
        method: 'delete',
        url: `/observations/${observationId}`,
      });

      if (response.data) {
        console.log('deleteObservation', response.data);
      }
    } catch (error: any) {
      handelError(error.response.data.message || 'error deleteObservation');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const updateObservations = async ({
    observationId,
    data,
  }: IUpdateObservation): Promise<IProjectCart | void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AxiosResponse<IUpdateObservation> = await apiInstance({
        method: 'put',
        url: `/observations/${observationId}`,
        data,
      });

      if (response.data) {
        console.log('updateObservations', response.data);
      }
    } catch (error: any) {
      handelError(error.response.data.message || 'error updateObservations');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const getConversationId = async (
    data: IGetConversationId
  ): Promise<IConversationIdResponse | undefined> => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<IConversationIdResponse | void> = await apiInstance({
        method: 'post',
        url: `/chat`,
        data: {
          accountId: data.accountId,
        },
      });
      if (response.data) {
        console.log('API getConversationId', response.data);
        return response.data;
      }
    } catch (error: any) {
      handelError(error.response.data.message || 'error getConversationId');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const startChat = async (data: IStartChat): Promise<ChatResponse | undefined> => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<ChatResponse> = await apiInstance({
        method: 'post',
        url: `/chat/${data.conversation}`,
        data: {
          language: data.language,
          message: data.message,
        },
      });
      if (response.data) {
        console.log('API startConversation', response.data);
        return response.data;
      }
    } catch (error: any) {
      handelError(error.response.data.message || 'error startConversation');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const getChat = async (id: string): Promise<ChatResponse | void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<ChatResponse> = await apiInstance({
        method: 'get',
        url: `/chat/${id}`,
      });
      if (response.data) {
        console.log('API startConversation', response.data);
        return response.data;
      }
    } catch (error: any) {
      handelError(error.response.data.message || 'error startConversation');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const reportShare = async (data: {
    comment: string;
    email: string;
    format: string;
    s3Uri: string;
  }): Promise<ChatResponse | void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<ChatResponse> = await apiInstance({
        method: 'post',
        url: `/observations/report/share`,
        data: {
          comment: data.comment,
          email: data.email,
          format: data.format,
          s3Uri: data.s3Uri,
        },
      });
      if (response.data) {
        console.log('API startConversation', response.data);
        return response.data;
      }
    } catch (error: any) {
      handelError(error.response.data.message || 'error startConversation');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllCategory = async (): Promise<IGetAllCategory[] | void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AxiosResponse<IGetAllCategory[]> = await apiInstance({
        method: 'get',
        url: '/observations/categories',
      });

      return response.data;
    } catch (error: any) {
      handelError(error.response.data.message || 'Fetch error projects');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createObservation,
    getAllObservations,
    deleteObservation,
    getFilterObservations,
    updateObservations,
    startChat,
    getConversationId,
    getChat,
    getAllCategory,
    reportShare,
    isLoading,
    error,
  };
};
