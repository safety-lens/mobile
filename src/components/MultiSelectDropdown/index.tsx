import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IMultiSelectRef, MultiSelect } from 'react-native-element-dropdown';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import { Typography } from '../Typography';

export interface IDropdownItem {
  label: string;
  description?: string;
  labelSelected?: string;
  value: string;
}

interface IDropdown {
  data: IDropdownItem[];
  searchPlaceholder?: string;
  search?: boolean;
  onChange: (e: string[]) => void;
  styleContainer?: StyleProp<ViewStyle>;
  label?: string;
  required?: boolean;
  error?: boolean;
  defaultValue?: string[];
  placeholderInput?: string;
}

export default function MultiSelectDropdown({
  data,
  placeholderInput = 'selectUser',
  searchPlaceholder,
  search,
  styleContainer,
  label,
  required,
  onChange,
  error,
  defaultValue = [],
}: IDropdown) {
  const { t } = useTranslation();
  const [value, setValue] = useState<string[]>(defaultValue as string[]);
  const [searchText, setSearchText] = useState<string>('');

  const dropdownRef = useRef<IMultiSelectRef>(null);

  const handleClear = useCallback(() => {
    setSearchText('');
  }, []);

  const resolvedSearchPlaceholder = searchPlaceholder || `${t('search')}...`;

  useEffect(() => {
    if (defaultValue.length) setValue(defaultValue as string[]);
  }, [defaultValue]);

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.label?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [data, searchText]);

  const renderItem = useCallback(
    (item: IDropdownItem) => (
      <View
        key={item.value}
        style={{
          borderRadius: 4,
          padding: 14,
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.label}</Text>
        {item.description && <Text>{item.description}</Text>}
      </View>
    ),
    []
  );

  const renderSelectedItem = useCallback((item: IDropdownItem) => {
    return (
      <View key={item.value} style={styles.selectedItemBadge}>
        <Text style={{ flexShrink: 1 }} numberOfLines={1}>
          {item.labelSelected ? item.labelSelected : item.label}
        </Text>
        <View style={styles.deleteIconContainer}>
          <Typography fullWidth={false} size="xxs">
            X
          </Typography>
        </View>
      </View>
    );
  }, []);

  const renderInputSearch = useCallback(() => {
    return (
      <View style={styles.searchContainer}>
        <TextInput
          value={searchText}
          underlineStyle={{ display: 'none' }}
          textColor="black"
          style={styles.searchInputField}
          placeholder={resolvedSearchPlaceholder}
          onChangeText={setSearchText}
          right={
            searchText.length && (
              <TextInput.Icon
                style={{ left: 10 }}
                icon="close"
                onPress={handleClear}
                forceTextInputFocus
              />
            )
          }
        />
      </View>
    );
  }, [handleClear, setSearchText, resolvedSearchPlaceholder, searchText]);

  const placeholder = `${value.length ? value.length + ' ' + t('selected') : t(placeholderInput)}`;

  return (
    <View>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.labelRequired}>{'*'}</Text>}
        </Text>
      )}
      <MultiSelect
        data={filteredData}
        ref={dropdownRef}
        value={value}
        renderItem={renderItem}
        renderInputSearch={renderInputSearch}
        renderSelectedItem={renderSelectedItem}
        itemTextStyle={styles.selectedTextStyle}
        itemContainerStyle={{ borderRadius: 8 }}
        containerStyle={{ borderRadius: 8 }}
        style={[styles.dropdown, styleContainer, error && { borderColor: 'red' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        search={search}
        labelField="name"
        valueField="value"
        searchPlaceholder={resolvedSearchPlaceholder}
        placeholder={placeholder}
        onFocus={() => {
          handleClear();
        }}
        onChange={(item) => {
          setValue(item);
          onChange(item);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 40,
    borderColor: '#D0D5DD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: 'white',
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    color: Colors.light.text,
    fontSize: 16,
    borderRadius: 8,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
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

  searchContainer: {
    flexDirection: 'row',
    borderColor: '#D0D5DD',
    borderWidth: 1,
    paddingHorizontal: 8,
    margin: 8,
    borderRadius: 8,
  },
  searchInputField: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: 'black',
  },
  selectedItemBadge: {
    flexDirection: 'row',
    alignItems: 'center',

    borderColor: '#d9d9d9',
    borderWidth: 1,
    borderRadius: 4,

    padding: 4,
    marginTop: 4,
    backgroundColor: '#00000006',
    gap: 8,
    marginRight: 4,
    maxWidth: '100%',
  },
  deleteIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    borderColor: '#d9d9d9',
    borderWidth: 1,
    width: 20,
    height: 20,
  },
});
