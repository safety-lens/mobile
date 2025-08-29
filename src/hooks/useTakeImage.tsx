import * as ImagePicker from 'expo-image-picker';
import useCameraPermissions from './useCameraPermissions';
import usePhotoPermissions from './usePhotoPermissions';

export default function useTakeImage() {
  const { requestCameraPermissions, checkCameraPermissions } = useCameraPermissions();
  const { checkPhotoPermissions, requestPhotoPermissions } = usePhotoPermissions();

  const takePhoto = async (onChange: (value: ImagePicker.ImagePickerAsset) => void) => {
    const hasPermission = await checkCameraPermissions();
    console.log('hasPermission', hasPermission);
    if (!hasPermission) {
      const granted = await requestCameraPermissions();
      console.log('granted', granted);

      if (!granted) return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (onChange) {
        onChange(result.assets[0]);
      }
    }
  };

  const pickImage = async (onChange: (value: ImagePicker.ImagePickerAsset) => void) => {
    const hasPermission = await requestPhotoPermissions();
    if (!hasPermission) {
      const granted = await checkPhotoPermissions();
      if (!granted) return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      onChange(result.assets[0]);
    }
  };

  return { takePhoto, pickImage };
}
