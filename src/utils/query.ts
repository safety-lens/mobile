import { GetNextPageParamFunction } from '@tanstack/react-query';

export type DefaultPaginatedResponse = {
  count?: number;
};

/**
 * It creates a function that returns the next page param for react-query
 *
 * eg:
 * useInfiniteQuery({
 *  queryKey,
 *  queryFn,
 *  getNextPageParam: createGetNextPageParam(limit),
 * });
 */
export const createGetNextPageParam: (
  limit: number
) => GetNextPageParamFunction<number, DefaultPaginatedResponse> =
  (limit) => (lastPage, _pages, lastPageParam) => {
    if (!lastPage) {
      return undefined;
    }
    const { count } = lastPage;
    if (!count) {
      return undefined;
    }
    const hasMore = count > lastPageParam * limit;
    return hasMore ? lastPageParam + 1 : undefined;
  };
