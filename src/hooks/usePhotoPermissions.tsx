import { Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';

export default function usePhotoPermissions() {
  const { t } = useTranslation();

  const checkPhotoPermissions = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    return status === 'granted';
  };

  const requestPhotoPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'denied') {
      Alert.alert(t('permission.required'), t('permission.required.photo'), [
        { text: t('cancelButton'), style: 'cancel' },
        { text: t('permission.openSettings'), onPress: () => Linking.openSettings() },
      ]);
      return false;
    }
    return status === 'granted';
  };
  return { checkPhotoPermissions, requestPhotoPermissions };
}
