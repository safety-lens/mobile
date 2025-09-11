import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { IMultiSelectRef, MultiSelect } from 'react-native-element-dropdown';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import { UserList } from '@/axios/api/auth';

interface IDropdownData {
  label: string;
  value: string;
  id?: string;
  name?: string;
}

interface IDropdown<T = UserList> {
  data: T[] | IDropdownData[];
  placeholder?: string;
  searchPlaceholder?: string;
  search?: boolean;
  onChange: (e: unknown[]) => void;
  styleContainer?: StyleProp<ViewStyle>;
  label?: string;
  required?: boolean;
  error?: boolean;
  defaultValue?: unknown[];
  placeholderInput?: string;
}

export default function MultiSelectDropdown<T = UserList>({
  data,
  placeholder = '...',
  placeholderInput = 'selectUser',
  searchPlaceholder,
  search,
  styleContainer,
  label,
  required,
  onChange,
  error,
  defaultValue = [],
}: IDropdown<T>) {
  const { t } = useTranslation();
  const [value, setValue] = useState<string[]>(defaultValue as string[]);
  const [searchText, setSearchText] = useState<string>('');
  const [isFocus, setIsFocus] = useState(false);

  const dropdownRef = useRef<IMultiSelectRef>(null);

  const handleSearch = (text: string) => {
    setSearchText(text);
  };
  const handleClear = () => {
    setSearchText('');
  };

  const resolvedSearchPlaceholder = searchPlaceholder || `${t('search')} ...`;

  useEffect(() => {
    if (defaultValue.length) setValue(defaultValue as string[]);
  }, [defaultValue]);

  return (
    <View>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.labelRequired}>{'*'}</Text>}
        </Text>
      )}
      <MultiSelect
        ref={dropdownRef}
        value={value}
        renderItem={(item) => (
          <View
            key={item.id}
            style={{
              borderRadius: 4,
              padding: 14,
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.name}</Text>
            {item.label && <Text>{item.label}</Text>}
          </View>
        )}
        renderInputSearch={() => (
          <View style={styles.searchContainer}>
            <TextInput
              value={searchText}
              underlineStyle={{ display: 'none' }}
              textColor="black"
              style={styles.searchInputField}
              placeholder={!isFocus ? placeholder : '...'}
              onChangeText={handleSearch}
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
        )}
        renderSelectedItem={(item) => (
          <View
            key={item.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',

              borderColor: '#d9d9d9',
              borderWidth: 1,
              borderRadius: 4,

              padding: 4,
              marginTop: 4,
              backgroundColor: '#00000006',
              gap: 12,
              marginRight: 4,
            }}
          >
            <Text>
              {item.name} {`${item.email ? `- ${item?.email} ` : ''}`}
            </Text>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 100,
                borderColor: '#d9d9d9',
                borderWidth: 1,
                width: 20,
                height: 20,
              }}
            >
              <Text style={{ fontSize: 12 }}>X</Text>
            </View>
          </View>
        )}
        itemTextStyle={styles.selectedTextStyle}
        itemContainerStyle={{ borderRadius: 8 }}
        containerStyle={{ borderRadius: 8 }}
        style={[styles.dropdown, styleContainer, error && { borderColor: 'red' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={data.filter((item) =>
          //@ts-expect-error  TODO: fix this
          item.name?.toLowerCase().includes(searchText.toLowerCase())
        )}
        search={search}
        labelField="name"
        valueField="id"
        searchPlaceholder={resolvedSearchPlaceholder}
        placeholder={t(placeholderInput)}
        onFocus={() => {
          setIsFocus(true);
          handleClear();
        }}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item);
          onChange(item);
          setIsFocus(false);
          // dropdownRef.current?.close();
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
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    color: Colors.light.text,
    fontSize: 16,
    borderRadius: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
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
  clearButton: {
    position: 'absolute',
    right: 10,
    padding: 8,
    backgroundColor: 'yellow',
    width: 10,
    height: 10,
  },
});
