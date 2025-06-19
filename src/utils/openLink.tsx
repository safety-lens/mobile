import {Linking} from 'react-native';

export const openLink = (url: string) => {
  Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  return true;
};
