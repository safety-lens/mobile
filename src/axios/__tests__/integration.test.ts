import MockAdapter from 'axios-mock-adapter';
import { apiInstance } from '../instances';
import { attachInterceptors } from '../index';
import { refreshAccessToken } from '../refresh';
import * as storage from '@/utils/storage';
import { logout } from '@/axios/utils';

// Intentionally DO NOT mock the queue module here: we want real queue behavior

jest.mock('../refresh');
jest.mock('@/utils/storage');
jest.mock('@/axios/utils');

const mockedRefresh = refreshAccessToken as jest.MockedFunction<
  typeof refreshAccessToken
>;
const mockedGetValueStorage = storage.getValueStorage as jest.MockedFunction<
  typeof storage.getValueStorage
>;
const mockedLogout = logout as jest.MockedFunction<typeof logout>;

describe('Axios Integration - Interceptors + Queue', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    attachInterceptors();
  });

  beforeEach(() => {
    mock = new MockAdapter(apiInstance);
    jest.clearAllMocks();
    // Provide an expired token in storage so request interceptor adds Authorization
    mockedGetValueStorage.mockResolvedValue(
      JSON.stringify({ accessToken: 'expired-token' })
    );
    (apiInstance as any).defaults.headers.common.Authorization = undefined;
  });

  afterEach(() => {
    mock.restore();
  });

  it('race: two 401s trigger a single refresh; second request is queued', async () => {
    const newToken = 'new-access-token';
    let resolveRefresh: (val: string) => void;

    const deferred = new Promise<string>((resolve) => {
      resolveRefresh = resolve;
    });
    mockedRefresh.mockReturnValue(deferred);

    // Both endpoints first respond 401, then succeed
    mock
      .onGet('/a')
      .replyOnce(401, { message: 'Unauthorized' })
      .onGet('/a')
      .replyOnce(200, { data: 'A' });

    mock
      .onGet('/b')
      .replyOnce(401, { message: 'Unauthorized' })
      .onGet('/b')
      .replyOnce(200, { data: 'B' });

    const pA = apiInstance.get('/a');
    const pB = apiInstance.get('/b');

    // Allow both to hit the interceptor and enqueue
    await new Promise((r) => setTimeout(r, 5));

    // Resolve refresh once
    resolveRefresh!(newToken);

    const [resA, resB] = await Promise.all([pA, pB]);
    expect(resA.data).toEqual({ data: 'A' });
    expect(resB.data).toEqual({ data: 'B' });
    expect(mockedRefresh).toHaveBeenCalledTimes(1);

    // Verify retried requests include the new token header (last two are retries)
    const retryRequests = mock.history.get.slice(-2);
    retryRequests.forEach((req) => {
      expect(req.headers?.Authorization).toBe(`Bearer ${newToken}`);
    });

    expect(mockedLogout).not.toHaveBeenCalled();
  });

  it('failure then reset: failed refresh rejects queued, next 401 triggers new refresh and succeeds', async () => {
    const refreshError = new Error('refresh failed');
    mockedRefresh.mockRejectedValueOnce(refreshError);

    mock.onGet('/x').reply(401, { message: 'Unauthorized' });

    await expect(apiInstance.get('/x')).rejects.toThrow('refresh failed');
    expect(mockedLogout).toHaveBeenCalledTimes(1);

    // Next cycle: refresh succeeds
    mockedRefresh.mockResolvedValueOnce('token-2');
    mock.onGet('/y').replyOnce(401).onGet('/y').replyOnce(200, { data: 'Y' });

    const resY = await apiInstance.get('/y');
    expect(resY.data).toEqual({ data: 'Y' });
    expect(mockedRefresh).toHaveBeenCalledTimes(2);
  });

  it('queued rejection on refresh failure: all in-flight 401s reject with refresh error', async () => {
    const refreshError = new Error('Refresh failed');
    mockedRefresh.mockRejectedValue(refreshError);

    mock.onGet('/m').reply(401);
    mock.onGet('/n').reply(401);

    const pM = apiInstance.get('/m');
    const pN = apiInstance.get('/n');

    await expect(pM).rejects.toThrow('Refresh failed');
    await expect(pN).rejects.toThrow('Refresh failed');
    expect(mockedRefresh).toHaveBeenCalledTimes(1);
    expect(mockedLogout).toHaveBeenCalledTimes(1);
  });
});
