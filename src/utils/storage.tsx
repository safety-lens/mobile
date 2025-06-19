import AsyncStorage from '@react-native-async-storage/async-storage';

type storageKey = 'auth' | 'accounts' | 'language' | 'authData' | 'showTip';

export const setValueStorage = async (key: storageKey, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('setValueStorage', e);
  }
};

export const getValueStorage = async (key: storageKey) => {
  try {
    const storedLanguage = await AsyncStorage.getItem(key);
    return storedLanguage;
  } catch (e) {
    console.error('getValueStorage', e);
  }
};
