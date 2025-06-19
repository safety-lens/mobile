import { IGetAllProject, useApiProject } from '@/axios/api/projects';
import { useAuth } from '@/context/AuthProvider';

export default function useGetAllProjects() {
  const { user } = useAuth();
  const { getAllProject } = useApiProject();

  const getProjects = async (data?: IGetAllProject) => {
    const userId = user?.auth.role !== 'user' ? user?.auth.id : undefined;
    getAllProject({ userId, ...data });
  };

  return { getProjects };
}
