import { IGetObservationsParams, observationsApi } from '@/axios/api/observations';
import { ObservationsResponse } from '@/types/observation';
import { createGetNextPageParam } from '@/utils/query';
import {
  InfiniteData,
  QueryFunctionContext,
  useInfiniteQuery,
} from '@tanstack/react-query';

const QUERY_KEY = 'observations';
const OBSERVATIONS_DEFAULT_LIMIT = 20;

type ObservationsParams = Omit<IGetObservationsParams, 'page' | 'rowsPerPage'>;

interface ObservationsQueryProps<T> extends ObservationsParams {
  limit?: number;
  select?: (data: InfiniteData<ObservationsResponse>) => T;
  enabled?: boolean;
}

type ObservationsDefaultKey = ReturnType<typeof observationsKeys.default>;

interface ObservationsKeysParams extends ObservationsParams {
  limit: number;
}

const observationsKeys = {
  default: ({
    limit,
    projectId,
    sortBy = 'createdAt',
    status,
    startPeriod,
    finishPeriod,
    sortDirection = 'desc',
  }: ObservationsKeysParams) =>
    [
      QUERY_KEY,
      {
        limit,
        projectId,
        sortBy,
        status,
        startPeriod,
        finishPeriod,
        sortDirection,
      },
    ] as const,
};

const getObservations = async ({
  queryKey,
  pageParam = 1,
}: QueryFunctionContext<ObservationsDefaultKey, number>) => {
  const { limit, ...rest } = queryKey[1];

  const response = await observationsApi.getObservations({
    page: pageParam,
    rowsPerPage: limit,
    ...rest,
  });
  return response;
};

const defaultProps = {
  limit: OBSERVATIONS_DEFAULT_LIMIT,
  enabled: true,
};

function useObservationsQuery<T = InfiniteData<ObservationsResponse>>({
  limit = OBSERVATIONS_DEFAULT_LIMIT,
  select,
  enabled = true,
}: ObservationsQueryProps<T> = defaultProps) {
  return useInfiniteQuery({
    queryKey: observationsKeys.default({ limit }),
    queryFn: getObservations,
    getNextPageParam: createGetNextPageParam(limit),
    initialPageParam: 1,
    select,
    enabled,
  });
}

export default useObservationsQuery;
