import { IGetAllProject, useApiProject } from '@/axios/api/projects';
import { IGetProjects } from '@/types/project';
import { createGetNextPageParam } from '@/utils/query';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

const QUERY_KEY = 'projects';
const PROJECTS_DEFAULT_LIMIT = 10; // 6???

interface ProjectsQueryProps<T> extends Omit<IGetAllProject, 'page' | 'rowsPerPage'> {
  limit?: number;
  select?: (data: InfiniteData<IGetProjects>) => T;
  enabled?: boolean;
}

interface ProjectsKeysParams extends Omit<IGetAllProject, 'page' | 'rowsPerPage'> {
  limit: number;
}

const projectsKeys = {
  default: ({
    limit,
    userId,
    searchQuery,
    sortBy,
    sortDirection,
    status,
    projectNumber,
  }: ProjectsKeysParams) =>
    [
      QUERY_KEY,
      {
        limit,
        userId,
        searchQuery,
        sortBy,
        sortDirection,
        status,
        projectNumber,
      },
    ] as const,
};

const defaultProps = {
  limit: PROJECTS_DEFAULT_LIMIT,
  enabled: true,
};

function useProjectsQuery<T = InfiniteData<IGetProjects>>({
  limit = PROJECTS_DEFAULT_LIMIT,
  select,
  enabled = true,
  ...rest
}: ProjectsQueryProps<T> = defaultProps) {
  const { getAllProject } = useApiProject();

  return useInfiniteQuery({
    queryKey: projectsKeys.default({ limit }),
    queryFn: () =>
      getAllProject({
        rowsPerPage: limit,
        ...rest,
      }),
    getNextPageParam: createGetNextPageParam(limit),
    initialPageParam: 1,
    select,
    enabled,
  });
}

export default useProjectsQuery;
