import * as ImagePicker from 'expo-image-picker';
import { Buffer } from 'buffer';

export const formDataFunc = (image: ImagePicker.ImagePickerAsset): FormData => {
  const formData = new FormData();
  if (image.uri.includes('base64')) {
    const base64Content = image.uri.replace(/^data:image\/\w+;base64,/, '');
    const binaryData = Buffer.from(base64Content, 'base64');
    formData.append(
      'file',
      new Blob([binaryData], { type: 'image/png' }),
      image.fileName || image.uri.slice(-40)
    );
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    formData.append('file', {
      uri: image.uri,
      type: 'image/png',
      name: image.fileName || image.uri.slice(-40),
    });
  }

  return formData;
};
