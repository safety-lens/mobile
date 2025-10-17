import { refreshAccessToken } from '../refresh';
import { apiPublicInstance } from '../instances';
import * as storage from '@/utils/storage';

// Mock dependencies
jest.mock('../instances', () => ({
  apiPublicInstance: {
    post: jest.fn(),
  },
}));

jest.mock('@/utils/storage');

const mockedApiPublicInstance = apiPublicInstance as jest.Mocked<
  typeof apiPublicInstance
>;
const mockedGetValueStorage = storage.getValueStorage as jest.MockedFunction<
  typeof storage.getValueStorage
>;
const mockedSetValueStorage = storage.setValueStorage as jest.MockedFunction<
  typeof storage.setValueStorage
>;
// no router import anymore; refresh no longer navigates

describe('useRefreshTokenFn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should refresh token successfully and return access token', async () => {
    const mockAuth = JSON.stringify({ refreshToken: 'valid-refresh-token' });
    const mockResponse = {
      data: {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      },
    };

    mockedGetValueStorage.mockResolvedValue(mockAuth);
    mockedApiPublicInstance.post.mockResolvedValue(mockResponse);

    const result = await refreshAccessToken();

    expect(mockedGetValueStorage).toHaveBeenCalledWith('auth');
    expect(mockedApiPublicInstance.post).toHaveBeenCalledWith('/auth/refresh', {
      refreshToken: 'valid-refresh-token',
    });
    expect(mockedSetValueStorage).toHaveBeenCalledWith(
      'auth',
      JSON.stringify(mockResponse.data)
    );
    expect(result).toBe('new-access-token');
  });

  it('should handle refresh failure by rejecting without navigation', async () => {
    const mockAuth = JSON.stringify({ refreshToken: 'invalid-refresh-token' });
    const refreshError = new Error('Invalid refresh token');

    mockedGetValueStorage.mockResolvedValue(mockAuth);
    mockedApiPublicInstance.post.mockRejectedValue(refreshError);

    await expect(refreshAccessToken()).rejects.toBe(refreshError);

    expect(mockedSetValueStorage).not.toHaveBeenCalled();
  });

  it('should handle missing auth data (no API call, reject)', async () => {
    mockedGetValueStorage.mockResolvedValue('');

    await expect(refreshAccessToken()).rejects.toBeDefined();

    // When auth is empty string, JSON.parse fails and goes to catch block
    // So the API should not be called
    expect(mockedApiPublicInstance.post).not.toHaveBeenCalled();
    expect(mockedSetValueStorage).not.toHaveBeenCalled();
  });

  it('should handle storage error (propagate error, no navigation)', async () => {
    const storageError = new Error('Storage access failed');
    mockedGetValueStorage.mockRejectedValue(storageError);

    await expect(refreshAccessToken()).rejects.toBe(storageError);
    expect(mockedSetValueStorage).not.toHaveBeenCalled();
  });
});
