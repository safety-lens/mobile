import { enqueueRequest, processQueue, setIsRefreshing, getIsRefreshing } from '../queue';
import { apiInstance } from '../instances';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

const mockApiInstance = apiInstance as jest.MockedFunction<typeof apiInstance>;

jest.mock('../instances', () => {
  const apiInstanceMock = Object.assign(jest.fn(), {
    defaults: { headers: { common: {} } },
  });
  return {
    apiPublicInstance: {},
    apiInstance: apiInstanceMock,
  };
});

describe('Axios Queue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setIsRefreshing(false);
    mockApiInstance.mockReset();
  });

  it('should toggle isRefreshing state', () => {
    expect(getIsRefreshing()).toBe(false);
    setIsRefreshing(true);
    expect(getIsRefreshing()).toBe(true);
    setIsRefreshing(false);
    expect(getIsRefreshing()).toBe(false);
  });

  it('should enqueue requests and resolve them with token applied on processQueue', async () => {
    const configA: AxiosRequestConfig = { url: '/a', headers: {} };
    const configB: AxiosRequestConfig = { url: '/b', headers: {} };

    const pA = enqueueRequest(configA);
    const pB = enqueueRequest(configB);

    mockApiInstance.mockResolvedValueOnce({ data: 'a' });
    mockApiInstance.mockResolvedValueOnce({ data: 'b' });

    processQueue(null, 'token-123');

    const [resA, resB] = (await Promise.all([pA, pB])) as AxiosResponse[];
    expect(resA.data).toBe('a');
    expect(resB.data).toBe('b');
    expect(configA.headers!.Authorization).toBe('Bearer token-123');
    expect(configB.headers!.Authorization).toBe('Bearer token-123');
    expect(mockApiInstance).toHaveBeenCalledTimes(2);
  });

  it('should reject enqueued requests when processQueue receives an error', async () => {
    const configA: AxiosRequestConfig = { url: '/a' };
    const configB: AxiosRequestConfig = { url: '/b' };

    const pA = enqueueRequest(configA);
    const pB = enqueueRequest(configB);

    const error = new Error('refresh failed');
    processQueue(error, null);

    await expect(pA).rejects.toBe(error);
    await expect(pB).rejects.toBe(error);
  });
});
