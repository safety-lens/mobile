import MockAdapter from 'axios-mock-adapter';
import { apiInstance } from '../instances';
import { attachInterceptors } from '../index';
import { refreshAccessToken } from '../refresh';
import * as storage from '@/utils/storage';
import { router } from 'expo-router';
import { logout } from '@/axios/utils';

// Mock dependencies
jest.mock('../refresh');
jest.mock('@/utils/storage');
jest.mock('@/axios/utils');

const mockedUseRefreshTokenFn = refreshAccessToken as jest.MockedFunction<
  typeof refreshAccessToken
>;
const mockedGetValueStorage = storage.getValueStorage as jest.MockedFunction<
  typeof storage.getValueStorage
>;
const mockedRouter = router as jest.Mocked<typeof router>;
const mockedLogout = logout as jest.MockedFunction<typeof logout>;

describe('Axios Interceptors', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    attachInterceptors();
  });

  beforeEach(() => {
    mock = new MockAdapter(apiInstance);
    jest.clearAllMocks();

    // Reset any internal state
    (apiInstance as any).defaults.headers.common.Authorization = undefined;
  });

  afterEach(() => {
    mock.restore();
  });

  describe('Request Interceptor', () => {
    it('should add authorization header when access token exists', async () => {
      const mockAuth = JSON.stringify({ accessToken: 'test-access-token' });
      mockedGetValueStorage.mockResolvedValue(mockAuth);

      mock.onGet('/test').reply(200, { data: 'success' });

      await apiInstance.get('/test');

      expect(mock.history.get[0].headers).toMatchObject({
        Authorization: 'Bearer test-access-token',
      });
    });

    it('should not add authorization header when no access token', async () => {
      mockedGetValueStorage.mockResolvedValue('{}');

      mock.onGet('/test').reply(200, { data: 'success' });

      await apiInstance.get('/test');

      expect(mock.history.get[0].headers?.Authorization).toBeUndefined();
    });

    it('should handle storage error gracefully', async () => {
      mockedGetValueStorage.mockRejectedValue(new Error('Storage error'));

      mock.onGet('/test').reply(200, { data: 'success' });

      await expect(apiInstance.get('/test')).rejects.toThrow('Storage error');
    });
  });

  describe('Response Interceptor - Token Refresh Queue', () => {
    beforeEach(() => {
      // Setup initial auth state
      const mockAuth = JSON.stringify({ accessToken: 'expired-token' });
      mockedGetValueStorage.mockResolvedValue(mockAuth);
    });

    it('should refresh token and retry request on 401 error', async () => {
      const newToken = 'new-access-token';
      mockedUseRefreshTokenFn.mockResolvedValue(newToken);

      // First request fails with 401, retry succeeds
      mock
        .onGet('/test')
        .replyOnce(401, { message: 'Unauthorized' })
        .onGet('/test')
        .replyOnce(200, { data: 'success' });

      const response = await apiInstance.get('/test');

      expect(mockedUseRefreshTokenFn).toHaveBeenCalledTimes(1);
      expect(response.data).toEqual({ data: 'success' });
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].headers?.Authorization).toBe(`Bearer ${newToken}`);
      expect(mockedLogout).not.toHaveBeenCalled();
    });

    it('should queue multiple concurrent requests during token refresh', async () => {
      const newToken = 'new-access-token';
      let refreshResolve: (value: string) => void;

      // Make refresh token function wait
      const refreshPromise = new Promise<string>((resolve) => {
        refreshResolve = resolve;
      });
      mockedUseRefreshTokenFn.mockReturnValue(refreshPromise);

      // Setup mock to fail first requests with 401, then succeed
      mock
        .onGet('/test1')
        .replyOnce(401, { message: 'Unauthorized' })
        .onGet('/test1')
        .replyOnce(200, { data: 'test1-success' });

      mock
        .onGet('/test2')
        .replyOnce(401, { message: 'Unauthorized' })
        .onGet('/test2')
        .replyOnce(200, { data: 'test2-success' });

      mock
        .onGet('/test3')
        .replyOnce(401, { message: 'Unauthorized' })
        .onGet('/test3')
        .replyOnce(200, { data: 'test3-success' });

      // Start multiple concurrent requests
      const request1Promise = apiInstance.get('/test1');
      const request2Promise = apiInstance.get('/test2');
      const request3Promise = apiInstance.get('/test3');

      // Allow some time for requests to be queued
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Resolve the refresh token
      refreshResolve!(newToken);

      // Wait for all requests to complete
      const [response1, response2, response3] = await Promise.all([
        request1Promise,
        request2Promise,
        request3Promise,
      ]);

      // Verify refresh was called only once
      expect(mockedUseRefreshTokenFn).toHaveBeenCalledTimes(1);

      // Verify all requests eventually succeeded
      expect(response1.data).toEqual({ data: 'test1-success' });
      expect(response2.data).toEqual({ data: 'test2-success' });
      expect(response3.data).toEqual({ data: 'test3-success' });

      // Verify all retry requests have the new token
      const retryRequests = mock.history.get.slice(3); // Skip initial failed requests
      retryRequests.forEach((request) => {
        expect(request.headers?.Authorization).toBe(`Bearer ${newToken}`);
      });
      expect(mockedLogout).not.toHaveBeenCalled();
    });

    it('should reject all queued requests when refresh fails', async () => {
      const refreshError = new Error('Refresh failed');
      mockedUseRefreshTokenFn.mockRejectedValue(refreshError);

      // Setup mock to fail with 401
      mock.onGet('/test1').reply(401, { message: 'Unauthorized' });
      mock.onGet('/test2').reply(401, { message: 'Unauthorized' });

      // Start multiple concurrent requests
      const request1Promise = apiInstance.get('/test1');
      const request2Promise = apiInstance.get('/test2');

      // Both should be rejected with the refresh error
      await expect(request1Promise).rejects.toThrow('Refresh failed');
      await expect(request2Promise).rejects.toThrow('Refresh failed');

      expect(mockedUseRefreshTokenFn).toHaveBeenCalledTimes(1);
      expect(mockedLogout).toHaveBeenCalledTimes(1);
    });

    it('should not retry request that already has _retry flag', async () => {
      mock.onGet('/test').reply(401, { message: 'Unauthorized' });

      // Create a request config with _retry already set
      const config = { url: '/test', _retry: true };

      await expect(apiInstance.request(config)).rejects.toMatchObject({
        response: { status: 401 },
      });

      expect(mockedUseRefreshTokenFn).not.toHaveBeenCalled();
      expect(mockedLogout).not.toHaveBeenCalled();
    });

    it('should handle case when refresh returns null/undefined token', async () => {
      mockedUseRefreshTokenFn.mockResolvedValue(null as any);

      mock.onGet('/test').reply(401, { message: 'Unauthorized' });

      await expect(apiInstance.get('/test')).rejects.toMatchObject({
        response: { status: 401 },
      });

      expect(mockedUseRefreshTokenFn).toHaveBeenCalledTimes(1);
      expect(mockedLogout).toHaveBeenCalledTimes(1);
    });

    it('should redirect to projects page on 403 error', async () => {
      mock.onGet('/test').reply(403, { message: 'Forbidden' });

      await expect(apiInstance.get('/test')).rejects.toMatchObject({
        response: { status: 403 },
      });

      expect(mockedRouter.replace).toHaveBeenCalledWith('/auth/projects');
      expect(mockedLogout).not.toHaveBeenCalled();
    });

    it('should pass through other HTTP errors without refresh attempt', async () => {
      mock.onGet('/test').reply(500, { message: 'Server Error' });

      await expect(apiInstance.get('/test')).rejects.toMatchObject({
        response: { status: 500 },
      });

      expect(mockedUseRefreshTokenFn).not.toHaveBeenCalled();
      expect(mockedLogout).not.toHaveBeenCalled();
    });

    it('should handle network errors without refresh attempt', async () => {
      mock.onGet('/test').networkError();

      await expect(apiInstance.get('/test')).rejects.toThrow();

      expect(mockedUseRefreshTokenFn).not.toHaveBeenCalled();
      expect(mockedLogout).not.toHaveBeenCalled();
    });
  });

  describe('Queue State Management', () => {
    beforeEach(() => {
      const mockAuth = JSON.stringify({ accessToken: 'expired-token' });
      mockedGetValueStorage.mockResolvedValue(mockAuth);
    });

    it('should properly reset queue state after successful refresh', async () => {
      const newToken = 'new-access-token';
      mockedUseRefreshTokenFn.mockResolvedValue(newToken);

      // First batch of requests
      mock
        .onGet('/test1')
        .replyOnce(401)
        .onGet('/test1')
        .replyOnce(200, { data: 'success1' });

      await apiInstance.get('/test1');

      // Second batch should work normally (not be queued)
      mock.onGet('/test2').reply(200, { data: 'success2' });

      const response2 = await apiInstance.get('/test2');

      expect(response2.data).toEqual({ data: 'success2' });
      expect(mockedUseRefreshTokenFn).toHaveBeenCalledTimes(1); // Only called for first batch
    });

    it('should properly reset queue state after failed refresh', async () => {
      const refreshError = new Error('Refresh failed');
      mockedUseRefreshTokenFn.mockRejectedValueOnce(refreshError);

      // First request fails
      mock.onGet('/test1').reply(401);
      await expect(apiInstance.get('/test1')).rejects.toThrow('Refresh failed');

      // Second request should trigger refresh again (state should be reset)
      mockedUseRefreshTokenFn.mockResolvedValueOnce('new-token');
      mock
        .onGet('/test2')
        .replyOnce(401)
        .onGet('/test2')
        .replyOnce(200, { data: 'success' });

      const response2 = await apiInstance.get('/test2');

      expect(response2.data).toEqual({ data: 'success' });
      expect(mockedUseRefreshTokenFn).toHaveBeenCalledTimes(2); // Called twice
    });
  });
});
