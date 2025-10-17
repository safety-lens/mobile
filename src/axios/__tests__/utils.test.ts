import { logout } from '../utils';
import { apiInstance } from '../instances';
import * as storage from '@/utils/storage';
import { router, SplashScreen } from 'expo-router';
import { processQueue, setIsRefreshing } from '@/axios/queue';

jest.mock('@/utils/storage');
jest.mock('expo-router');
jest.mock('@/axios/queue', () => ({
  processQueue: jest.fn(),
  setIsRefreshing: jest.fn(),
}));

const mockedSetValueStorage = storage.setValueStorage as jest.MockedFunction<
  typeof storage.setValueStorage
>;
const mockedRouter = router as jest.Mocked<typeof router>;
const mockedSplash = SplashScreen as jest.Mocked<typeof SplashScreen>;
const mockedProcessQueue = processQueue as jest.MockedFunction<typeof processQueue>;
const mockedSetIsRefreshing = setIsRefreshing as jest.MockedFunction<
  typeof setIsRefreshing
>;

describe('utils.logout', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (apiInstance as any).defaults = {
      headers: { common: { Authorization: 'Bearer initial-token' } },
    };
  });

  it('clears storage, headers, queue state and navigates to root', async () => {
    await logout();

    // storage cleared
    expect(mockedSetValueStorage).toHaveBeenNthCalledWith(1, 'auth', '');
    expect(mockedSetValueStorage).toHaveBeenNthCalledWith(2, 'accounts', '');

    // header cleared
    expect((apiInstance as any).defaults.headers.common.Authorization).toBeUndefined();

    // queue reset
    expect(mockedSetIsRefreshing).toHaveBeenCalledWith(false);
    expect(mockedProcessQueue).toHaveBeenCalledTimes(1);
    const [firstArg, secondArg] = mockedProcessQueue.mock.calls[0];
    expect(firstArg).toBeInstanceOf(Error);
    expect((firstArg as Error).message).toBe('logout');
    expect(secondArg).toBeNull();

    // navigation + splash
    expect(mockedRouter.replace).toHaveBeenCalledWith('/');
    expect(mockedSplash.hideAsync).toHaveBeenCalled();
  });

  it('handles missing Authorization header gracefully', async () => {
    // Remove header before calling logout
    (apiInstance as any).defaults = { headers: { common: {} } };

    await expect(logout()).resolves.toBeUndefined();

    expect(mockedSetValueStorage).toHaveBeenCalledTimes(2);
    expect(mockedSetIsRefreshing).toHaveBeenCalledWith(false);
    expect(mockedProcessQueue).toHaveBeenCalled();
    expect(mockedRouter.replace).toHaveBeenCalledWith('/');
    expect(mockedSplash.hideAsync).toHaveBeenCalled();
  });
});
