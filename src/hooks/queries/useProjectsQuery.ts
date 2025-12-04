import { IGetAllProject, projectsApi, useApiProject } from '@/axios/api/projects';
import { IGetProjects } from '@/types/project';
import { createGetNextPageParam } from '@/utils/query';
import {
  InfiniteData,
  QueryFunctionContext,
  useInfiniteQuery,
} from '@tanstack/react-query';

const QUERY_KEY = 'projects';
const PROJECTS_DEFAULT_LIMIT = 10;

interface ProjectsQueryProps<T> extends Omit<IGetAllProject, 'page' | 'rowsPerPage'> {
  limit?: number;
  select?: (data: InfiniteData<IGetProjects>) => T;
  enabled?: boolean;
}

interface ProjectsKeysParams extends Omit<IGetAllProject, 'page' | 'rowsPerPage'> {
  limit: number;
}

type ProjectsDefaultKey = ReturnType<typeof projectsKeys.default>;

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

const queryFn = ({
  queryKey,
  pageParam = 1,
}: QueryFunctionContext<ProjectsDefaultKey, number>) => {
  const [, params] = queryKey;
  const { limit, userId, searchQuery, sortBy, sortDirection, status, projectNumber } =
    params;
  return projectsApi.getAllProjects({
    userId,
    searchQuery,
    sortBy,
    sortDirection,
    status,
    projectNumber,
    page: pageParam,
    rowsPerPage: limit,
  });
};

// TODO: add useProjectsPaginatedQuery based on useQuery for non infinite scroll use cases, e.g. projects screen
function useProjectsQuery<T = InfiniteData<IGetProjects>>({
  limit = PROJECTS_DEFAULT_LIMIT,
  select,
  enabled = true,
}: ProjectsQueryProps<T> = defaultProps) {
  return useInfiniteQuery({
    queryKey: projectsKeys.default({ limit }),
    queryFn,
    getNextPageParam: createGetNextPageParam(limit),
    initialPageParam: 1,
    select,
    enabled,
  });
}

export default useProjectsQuery;
