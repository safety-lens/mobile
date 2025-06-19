import { View, Text, StyleSheet, Platform } from 'react-native';
import React from 'react';
import { Control, Controller, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { Checkbox } from 'react-native-paper';
import Markdown from 'react-native-markdown-display';
import { openLink } from '@/utils/openLink';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';

interface IField<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
}

export default function CheckboxField<T extends FieldValues>({
  control,
  errors,
  name,
  required,
  label,
}: IField<T>) {
  const { t } = useTranslation();

  return (
    <View>
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field: { value, onChange } }) => (
          <View style={styles.checkboxField}>
            {Platform.OS === 'ios' && (
              <View
                style={{
                  position: 'absolute',
                  borderColor: '#0A2540',
                  borderWidth: 1,
                  backgroundColor: value ? '#0A2540' : '',
                  borderRadius: 4,
                  width: 25,
                  height: 25,
                  top: 6,
                  left: 5,
                }}
              />
            )}
            <Checkbox
              color={Platform.OS === 'ios' ? 'white' : Colors.light.text}
              status={value ? 'checked' : 'unchecked'}
              onPress={() => onChange(!value)}
            />
            <View style={styles.labelBox}>
              {required && <Text style={styles.labelRequired}>{'*'}</Text>}
              <Markdown style={{ body: styles.label }} onLinkPress={openLink}>
                {label}
              </Markdown>
            </View>
          </View>
        )}
      />
      {errors?.[name] && <Text style={styles.error}>{t('required')}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxField: {
    flexDirection: 'row',
    gap: 5,
    marginLeft: -4,
  },
  labelBox: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 5,
  },
  label: {
    marginTop: -11,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.light.text,
    lineHeight: 20,
    width: '90%',
  },
  labelRequired: {
    color: '#EF6F08',
  },
  error: {
    borderColor: 'red',
    color: 'red',
  },
});
