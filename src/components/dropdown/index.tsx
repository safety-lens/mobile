import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';

interface IDropdown {
  data: { label: string; value: string }[];
  placeholder?: string;
  searchPlaceholder?: string;
  search?: boolean;
  onChange: (e: { label: string; value: string }) => void;
  styleContainer?: StyleProp<ViewStyle>;
  label?: string;
  required?: boolean;
  defaultValue?: string;
  error?: boolean;
}

export default function DropdownItem({
  data,
  placeholder = '...',
  searchPlaceholder,
  search,
  styleContainer,
  label,
  required,
  defaultValue = '',
  onChange,
  error,
}: IDropdown) {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>('Archived');
  const [searchText, setSearchText] = useState<string>('');
  const [isFocus, setIsFocus] = useState(false);

  const handleSearch = (text: string) => {
    setSearchText(text);
  };
  const handleClear = () => {
    setSearchText('');
  };

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const resolvedSearchPlaceholder = searchPlaceholder || `${t('search')} ...`;

  return (
    <View>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.labelRequired}>{'*'}</Text>}
        </Text>
      )}
      <Dropdown
        itemTextStyle={styles.selectedTextStyle}
        itemContainerStyle={{ borderRadius: 8 }}
        containerStyle={{ borderRadius: 8 }}
        style={[styles.dropdown, styleContainer, error && { borderColor: 'red' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={data.filter((item) =>
          item.label.toLowerCase().includes(searchText.toLowerCase())
        )}
        search={search}
        labelField="label"
        valueField="value"
        searchPlaceholder={resolvedSearchPlaceholder}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          onChange(item);
          setIsFocus(false);
        }}
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
                searchText.length ? (
                  <TextInput.Icon
                    icon="close"
                    onPress={handleClear}
                    forceTextInputFocus
                  />
                ) : null
              }
            />
          </View>
        )}
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
