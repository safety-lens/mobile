import { IGetObservationsParams, observationsApi } from '@/axios/api/observations';
import { ObservationsResponse } from '@/types/observation';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';

const QUERY_KEY = 'observations';
const OBSERVATIONS_DEFAULT_LIMIT = 20;

type ObservationsParams = Omit<IGetObservationsParams, 'rowsPerPage'>;

interface ObservationsQueryProps<T> extends ObservationsParams {
  limit?: number;
  page?: number;
  select?: (data: ObservationsResponse) => T;
  enabled?: boolean;
}

type ObservationsDefaultKey = ReturnType<typeof observationsKeys.default>;

interface ObservationsKeysParams extends ObservationsParams {
  limit: number;
}

const observationsKeys = {
  default: ({
    page,
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
      'paginated',
      {
        page,
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
}: QueryFunctionContext<ObservationsDefaultKey>) => {
  const { limit, ...rest } = queryKey[2];

  const response = await observationsApi.getObservations({
    pageSize: limit,
    ...rest,
  });
  return response;
};

const defaultProps = {
  limit: OBSERVATIONS_DEFAULT_LIMIT,
  enabled: true,
};

function useObservationsPaginatedQuery<T = ObservationsResponse>({
  limit = OBSERVATIONS_DEFAULT_LIMIT,
  page,
  select,
  enabled = true,
}: ObservationsQueryProps<T> = defaultProps) {
  return useQuery({
    queryKey: observationsKeys.default({ page, limit }),
    queryFn: getObservations,
    select,
    enabled,
  });
}

export default useObservationsPaginatedQuery;
