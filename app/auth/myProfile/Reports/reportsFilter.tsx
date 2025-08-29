import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, View } from 'react-native';
import DropdownItem from '@/components/dropdown';
import CustomButton from '@/components/CustomButton/button';
import { useQuery } from '@tanstack/react-query';
import { apiInstance } from '@/axios';
import { IGetAllCategory } from '@/axios/api/observations';
import { AxiosResponse } from 'axios';
import { UserList } from '@/axios/api/auth';
import { Colors } from '@/constants/Colors';

export interface IReportsFilter {
  location: string;
  contractor: string;
  category: string;
  status: string;
  assigneeId: string;
}

const statusTitle = (t: (key: string) => string) => [
  { label: t('notAddressed'), value: 'Not addressed' },
  { label: t('inProgress'), value: 'In progress' },
  { label: t('addressed'), value: 'Addressed' },
];

export default function ReportsFilter({
  onClose,
  onApply,
  filters,
}: {
  onClose: () => void;
  onApply: (data: IReportsFilter) => void;
  projectId?: string;
  filters: IReportsFilter;
}) {
  const { t } = useTranslation();

  const [contractor, setGeneralContractor] = useState('');
  const [location, setLocation] = useState('');

  const { setValue, getValues } = useForm<IReportsFilter>({
    defaultValues: {
      location: '',
      contractor: '',
      category: '',
      status: '',
      assigneeId: '',
    },
  });

  const clear = () => {
    setGeneralContractor('');
    setLocation('');
    setValue('contractor', '');
    setValue('category', '');
    setValue('status', '');
    setValue('assigneeId', '');
    onApply(getValues());
    onClose();
  };

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response: AxiosResponse<IGetAllCategory[]> = await apiInstance.get(
        `/observations/categories`
      );
      return response.data;
    },
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response: AxiosResponse<UserList[]> = await apiInstance.get(`/users/members`);
      return response.data;
    },
  });

  const assigneeTitle = [{ id: '', email: t('all') }, ...(users || [])];

  return (
    <View style={{ gap: 18 }}>
      <View style={{ gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '500' }}>{t('contractor')}</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#D0D5DD',
            padding: 10,
            borderRadius: 8,
            textAlignVertical: 'top',
          }}
          onChangeText={(e) => {
            setValue('contractor', e);
            setGeneralContractor(e);
          }}
          placeholderTextColor={Colors.light.text}
          placeholder={t('contractor')}
          value={contractor || filters.contractor}
        />
      </View>

      <View style={{ gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '500' }}>{t('location')}</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#D0D5DD',
            padding: 10,
            borderRadius: 8,
          }}
          onChangeText={(e) => {
            setValue('location', e);
            setLocation(e);
          }}
          placeholderTextColor={Colors.light.text}
          placeholder={t('location')}
          value={location || filters.location}
        />
      </View>

      <DropdownItem
        search
        data={
          categories?.map((category) => ({
            label: category.name,
            value: category.name,
          })) || []
        }
        onChange={(e) => setValue('category', e.value)}
        label={t('categoryOfObservation')}
        defaultValue={filters.category}
      />

      <DropdownItem
        data={statusTitle(t)}
        onChange={(e) => setValue('status', e.value)}
        label={t('statusOfObservation')}
        defaultValue={filters.status}
      />

      <DropdownItem
        search
        data={assigneeTitle.map((user) => ({
          label: user.email,
          value: user.id,
        }))}
        onChange={(e) => setValue('assigneeId', e.value)}
        label={t('assignee')}
        defaultValue={filters.assigneeId}
      />

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <CustomButton
          title={t('resetAll')}
          styleAppBtn={{ flex: 1, borderWidth: 1, borderColor: 'grey', elevation: 0 }}
          styleBtn={{ color: 'black' }}
          backgroundColor="white"
          onPress={() => {
            clear();
          }}
        />
        <CustomButton
          title={t('applyNow')}
          styleAppBtn={{ flex: 1, elevation: 0 }}
          onPress={() => {
            onApply(getValues());
            onClose();
          }}
        />
      </View>
    </View>
  );
}
