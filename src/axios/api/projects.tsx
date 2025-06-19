/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICreateProject } from '@/components/createNewProject';
import { apiInstance } from '..';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useProjects } from '@/context/projectsProvider';
import { IGetProjects, IProjectCart, ProjectStatus, UpdateRes } from '@/types/project';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { UserList } from './auth';

interface ApiResponse extends ICreateProject {
  _id: string;
}
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
interface IGetSingleProject {
  projectNumber?: string;
  id?: string;
}
interface IRemoveProject {
  projectId: string;
}
interface IUpdateProject {
  projectId: string;
  data: {
    name?: string;
    projectNumber?: string;
    mainPhoto?: string;
  };
}
interface IArchiveProject {
  projectId: string;
  status: 'Active' | 'Archived';
}

export interface GetAllCompanies {
  id: string;
  name: string;
}

interface IAddMembers {
  projectId: string;
  usersIds: string[];
}

export interface PushNotificationDevice {
  deviceId: string;
  token: string;
  _id: string;
}

export interface UserNotificationData {
  email: string;
  pushNotificationsData: PushNotificationDevice[];
}

interface UseApiSignInReturn {
  createProject: (data: ICreateProject) => Promise<void>;
  getAllProject: (data: IGetAllProject) => Promise<IGetProjects | void>;
  deleteProject: (data: IRemoveProject) => Promise<void>;
  getSingleProject: (data: IGetSingleProject) => Promise<IProjectCart | undefined>;
  updateProject: (data: IUpdateProject) => Promise<UpdateRes | void>;
  archiveProject: (data: IArchiveProject) => Promise<void>;
  getAllCompanies: () => Promise<GetAllCompanies[] | void>;
  getProjectMembers: (data: IRemoveProject) => Promise<UserList[]>;
  addMembersToProject: (data: IAddMembers) => Promise<UserList[]>;
  isLoading: boolean;
  error: string | null;
}

export const useApiProject = (): UseApiSignInReturn => {
  const { setProjects, setSingleProject, setStatusFilter } = useProjects();
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

  const createProject = async (data: ICreateProject): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AxiosResponse<ApiResponse> = await apiInstance({
        method: 'post',
        url: '/projects',
        data,
      });
      if (response.data) {
        console.log('createProject', response.data);
      }
    } catch (error: any) {
      handelError(error.response.data.message || 'error createProject');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllProject = async ({
    userId,
    searchQuery,
    sortBy = 'createdAt',
    sortDirection = 'desc',
    page = 1,
    rowsPerPage = 6,
    status,
  }: IGetAllProject): Promise<IGetProjects | void> => {
    try {
      setIsLoading(true);
      setError(null);
      setStatusFilter(status || 'Active');

      const response: AxiosResponse<IGetProjects> = await apiInstance({
        method: 'get',
        url: '/projects',
        params: {
          userId,
          page,
          rowsPerPage,
          searchQuery,
          sortBy,
          sortDirection,
          status,
        },
      });

      if (response.data) {
        setProjects(response.data);
      }
    } catch (error: any) {
      handelError(error.response.data.message || 'Fetch error projects');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllCompanies = async (): Promise<GetAllCompanies[] | void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AxiosResponse<GetAllCompanies[]> = await apiInstance({
        method: 'get',
        url: '/accounts/all',
      });

      if (response.data) {
        return response.data;
      }
    } catch (error: any) {
      handelError(error.response.data.message || 'Fetch error projects');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const getSingleProject = async ({
    id,
  }: IGetSingleProject): Promise<IProjectCart | undefined> => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AxiosResponse = await apiInstance({
        method: 'get',
        url: '/projects',
        params: {
          id,
        },
      });

      if (response.data) {
        setSingleProject(response.data.projects[0]);
        return response.data.projects[0];
      }
    } catch (error: any) {
      setSingleProject(null);
      handelError(error.response.data.message || 'Error single project');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async ({ projectId }: IRemoveProject): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AxiosResponse<IRemoveProject> = await apiInstance({
        method: 'delete',
        url: `/projects/${projectId}`,
      });

      if (response.data) {
        console.log('deleteProject', response.data);
      }
    } catch (error: any) {
      handelError(error.response.data.message || 'error deleteProject');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async ({
    projectId,
    data,
  }: IUpdateProject): Promise<UpdateRes> => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AxiosResponse<UpdateRes> = await apiInstance({
        method: 'put',
        url: `/projects/${projectId}`,
        data,
      });

      if (response.data) {
        console.log('updateProject', response.data);
        return response.data;
      } else {
        throw new Error('No updateProject in response');
      }
    } catch (error: any) {
      handelError(error.response.data.message || 'error updateProject');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const archiveProject = async ({
    projectId,
    status,
  }: IArchiveProject): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<IArchiveProject> = await apiInstance({
        method: 'patch',
        url: `/projects/archived/${projectId}`,
        data: { status },
      });
      if (response.data) {
        console.log('archiveProject', response.data);
        return undefined;
      }
    } catch (error: any) {
      handelError(error.response.data.message || 'error archiveProject');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const getProjectMembers = async ({
    projectId,
  }: IRemoveProject): Promise<UserList[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AxiosResponse<UserList[]> = await apiInstance({
        method: 'get',
        url: `/projects/members/${projectId}`,
      });

      return response.data;
    } catch (error: any) {
      handelError(error.response.data.message || 'Fetch error projects');
      throw error.response.data.message;
    } finally {
      setIsLoading(false);
    }
  };

  const addMembersToProject = async ({
    projectId,
    usersIds,
  }: IAddMembers): Promise<UserList[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AxiosResponse<UserList[]> = await apiInstance({
        method: 'PATCH',
        url: `/projects/members/${projectId}`,
        data: {
          usersIds,
        },
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
    createProject,
    getAllProject,
    deleteProject,
    getSingleProject,
    updateProject,
    archiveProject,
    getAllCompanies,
    getProjectMembers,
    addMembersToProject,

    isLoading,
    error,
  };
};
