import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import SearchIcon from '../../../assets/svgs/search';
import { Colors } from '@/constants/Colors';
import { useApiProject } from '@/axios/api/projects';
import { useAuth } from '@/context/AuthProvider';
import { debounce } from '@/utils/debouncer';
import { useTranslation } from 'react-i18next';
import { useProjects } from '@/context/projectsProvider';
import IconClose from '../../../assets/svgs/iconClose';

export default function Search() {
  const { user } = useAuth();
  const { statusFilter } = useProjects();
  const [search, setSearch] = useState('');
  const { t } = useTranslation();

  const { getAllProject } = useApiProject();

  const searchProject = async (text: string) => {
    const isUserId = user?.auth.role !== 'user' ? user?.auth.id : undefined;

    if (user)
      await getAllProject({ userId: isUserId, searchQuery: text, status: statusFilter });
  };

  const handleSearch = useCallback(
    debounce((text: string) => {
      searchProject(text);
    }, 1000),
    []
  );

  const setSearchText = (text: string) => {
    setSearch(text);
    handleSearch(text);
  };

  return (
    <View style={styles.searchFieldBox}>
      <View style={styles.searchIconBox}>
        <SearchIcon fill={search.length ? Colors.light.text : undefined} />
      </View>
      <TextInput
        value={search}
        onChangeText={setSearchText}
        placeholder={t('search')}
        style={styles.textField}
      />
      {!!search.length && (
        <TouchableOpacity
          onPress={() => setSearchText('')}
          style={{
            position: 'absolute',
            right: 14,
            opacity: 0.6,
          }}
        >
          <IconClose />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchFieldBox: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIconBox: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  textField: {
    flex: 1,
    color: Colors.light.text,
    borderColor: '#D0D5DD',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 35,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
});
