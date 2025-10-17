import { logout } from '../utils';
import * as storage from '@/utils/storage';
import { router } from 'expo-router';
import { apiInstance } from '../instances';
import * as queue from '../queue';

jest.mock('@/utils/storage');
jest.mock('expo-router', () => ({ router: { replace: jest.fn() } }));
jest.mock('../instances', () => ({
  apiPublicInstance: {},
  apiInstance: {
    defaults: { headers: { common: { Authorization: 'Bearer old' } } },
  },
}));

describe('axios utils - logout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiInstance.defaults.headers.common as any).Authorization = 'Bearer old';
  });

  it('should clear storage, headers, reset queue and navigate', async () => {
    const spySetIsRefreshing = jest.spyOn(queue, 'setIsRefreshing');
    const spyProcessQueue = jest.spyOn(queue, 'processQueue');

    await logout();

    expect(storage.setValueStorage).toHaveBeenCalledWith('auth', '');
    expect(storage.setValueStorage).toHaveBeenCalledWith('accounts', '');
    expect((apiInstance.defaults.headers.common as any).Authorization).toBeUndefined();
    expect(spySetIsRefreshing).toHaveBeenCalledWith(false);
    expect(spyProcessQueue).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith('/');
  });
});

