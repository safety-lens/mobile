import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Control, Controller, FieldErrors, FieldValues, Path } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '../CustomButton/button';
import IconUploadImage from '../../../assets/svgs/uplaodImage';
import IconClose from '../../../assets/svgs/iconClose';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import usePhotoPermissions from '@/hooks/usePhotoPermissions';

interface ITextField<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  name: Path<T>;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export default function UploadPhoto<T extends FieldValues>({
  control,
  errors,
  name,
  label,
  required,
}: ITextField<T>) {
  const { t } = useTranslation();
  const { checkPhotoPermissions, requestPhotoPermissions } = usePhotoPermissions();

  const pickImage = async (onChange: (value: ImagePicker.ImagePickerResult) => void) => {
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
      console.log('result.assets[0]', result);
      onChange(result);
    }
  };

  return (
    <View>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.labelRequired}>{'*'}</Text>}
      </Text>
      <Controller
        control={control}
        name={name}
        rules={{
          required: required,
        }}
        render={({ field: { value, onChange } }) => {
          const imageUri =
            value?.assets?.[0]?.uri || (typeof value === 'string' ? value : null);
          return (
            <>
              <CustomButton
                icon={<IconUploadImage />}
                title={t('uploadPhoto')}
                backgroundColor="#F9F9F9"
                styleBtn={{ color: '#000' }}
                styleAppBtn={{ width: 200, marginTop: 12 }}
                onPress={() => pickImage(onChange)}
              />
              {imageUri && (
                <View style={styles.uploadImageBox}>
                  <Image source={{ uri: imageUri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.uploadImageRemove}
                    onPress={() => onChange(null)}
                  >
                    <IconClose />
                  </TouchableOpacity>
                </View>
              )}
            </>
          );
        }}
      />
      {errors?.[name] && <Text style={styles.error}>{t('required')}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    borderColor: 'red',
    color: 'red',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  labelRequired: {
    color: '#EF6F08',
  },
  uploadImageBox: {
    position: 'relative',
    width: 250,
    height: 250,
  },
  uploadImageRemove: {
    position: 'absolute',
    top: 12,
    right: 0,
    backgroundColor: 'grey',
  },
  image: {
    marginTop: 12,
    width: 250,
    height: 250,
  },
});
