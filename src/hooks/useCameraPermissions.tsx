import { Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';

export default function useCameraPermissions() {
  const { t } = useTranslation();

  const checkCameraPermissions = async () => {
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    return status === 'granted';
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'denied') {
      Alert.alert(t('permission.required'), t('permission.required.camera'), [
        { text: t('cancelButton'), style: 'cancel' },
        { text: t('permission.openSettings'), onPress: () => Linking.openSettings() },
      ]);
      return false;
    }
    return status === 'granted';
  };
  return { checkCameraPermissions, requestCameraPermissions };
}
