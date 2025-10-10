import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardTypeOptions,
  TextInputProps,
} from 'react-native';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  ValidationRule,
} from 'react-hook-form';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import EyePassword from '../../../assets/svgs/eyePassword';
import EyePasswordHide from '../../../assets/svgs/eyePasswordHide';

interface ITextField<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  name: Path<T>;
  placeholder?: string;
  label?: string;
  required?: boolean;
  pattern?: ValidationRule<RegExp> | undefined;
  secureText?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoComplete?: TextInputProps['autoComplete'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  hideRequiredSymbol?: boolean;
}

export default function TextField<T extends FieldValues>({
  control,
  errors,
  name,
  placeholder,
  label,
  required,
  hideRequiredSymbol = false,
  pattern,
  secureText,
  autoComplete,
  autoCapitalize,
  keyboardType,
}: ITextField<T>) {
  const message = errors?.[name]?.message as string;
  const [isPassword, setIsPassword] = useState(secureText);
  const { t } = useTranslation();
  return (
    <View>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && !hideRequiredSymbol && (
            <Text style={styles.labelRequired}>{'*'}</Text>
          )}
        </Text>
      )}
      <Controller
        control={control}
        name={name}
        rules={{
          required: required,
          minLength: 2,
          pattern: pattern,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{ position: 'relative' }}>
            {secureText && (
              <TouchableOpacity
                onPress={() => setIsPassword(!isPassword)}
                style={{ position: 'absolute', top: '25%', right: 10, zIndex: 1 }}
              >
                {isPassword ? <EyePassword /> : <EyePasswordHide />}
              </TouchableOpacity>
            )}
            <TextInput
              keyboardType={keyboardType}
              secureTextEntry={isPassword}
              placeholder={placeholder}
              placeholderTextColor="#717680"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoComplete={autoComplete}
              autoCapitalize={autoCapitalize}
              style={[styles.textField, errors?.[name] ? styles.error : null]}
            />
          </View>
        )}
      />
      {errors?.[name] && <Text style={styles.error}>{message || t('required')}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    borderColor: 'red',
    color: 'red',
  },
  textField: {
    borderColor: '#D0D5DD',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
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
});
