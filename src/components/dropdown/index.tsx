import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { screenHeight } from '@/utils/dimensions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IDropdown {
  data: { label: string; value: string | undefined }[];
  placeholder?: string;
  searchPlaceholder?: string;
  mode?: 'default' | 'modal' | 'auto';
  dropdownPosition?: 'top' | 'bottom';
  search?: boolean;
  onChange: (e: { label: string; value: string }) => void;
  isFetchingNextPage?: boolean;
  onEndReached?: () => void;
  styleContainer?: StyleProp<ViewStyle>;
  label?: string;
  required?: boolean;
  defaultValue?: string;
  error?: boolean;
}

export default function DropdownItem({
  data,
  placeholder = 'Select item',
  searchPlaceholder,
  search,
  styleContainer,
  label,
  required,
  mode = 'default',
  dropdownPosition = 'bottom',
  defaultValue = '',
  isFetchingNextPage = false,
  onEndReached,
  onChange,
  error,
}: IDropdown) {
  const { top, bottom } = useSafeAreaInsets();
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
  const maxHeight = screenHeight * 0.5 - top - bottom;
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
        containerStyle={{
          borderRadius: 8,
          ...(mode === 'modal' ? { maxHeight: maxHeight } : null),
          ...(mode === 'modal' && searchText ? { height: maxHeight } : null),
        }}
        style={[styles.dropdown, styleContainer, error && { borderColor: 'red' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={data.filter((item) =>
          item?.label?.toLowerCase()?.includes(searchText.toLowerCase())
        )}
        dropdownPosition={dropdownPosition}
        search={search}
        mode={mode}
        labelField="label"
        valueField="value"
        searchPlaceholder={resolvedSearchPlaceholder}
        placeholder={placeholder}
        value={value}
        onFocus={() => {
          setIsFocus(true);
          handleClear();
        }}
        flatListProps={{
          onEndReached,
          onEndReachedThreshold: 0.7,
          ListFooterComponent: isFetchingNextPage ? (
            <ActivityIndicator size="small" />
          ) : null,
        }}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          onChange(item);
          setIsFocus(false);
        }}
        autoScroll={false}
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
                    style={{ left: 10 }}
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
});
