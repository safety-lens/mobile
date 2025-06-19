import React from 'react';
import DropdownItem from '../dropdown';
import { useTranslation } from 'react-i18next';
import useGetUserInfo from '@/hooks/getUserInfo';

const data = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
];

export default function LanguageSelect() {
  const { t } = useTranslation();
  const { lang, onChangeLang } = useGetUserInfo();

  return (
    <DropdownItem
      defaultValue={lang || 'en'}
      placeholder={t('selectLanguage')}
      data={data}
      onChange={(e) => onChangeLang(e.value)}
    />
  );
}
