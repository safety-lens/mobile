import { UserAccountData } from '@/axios/api/auth';
import { useAuth } from '@/context/AuthProvider';
import i18n from '@/localization/i18n';
import { getValueStorage, setValueStorage } from '@/utils/storage';
import { useCallback, useEffect, useState } from 'react';

interface useGetUserInfo {
  user: UserAccountData | null;
  refreshUserInfo: () => void;
  isAdmin: boolean;
  lang: string | undefined | null;
  onChangeLang: (lang: string) => void;
  isAdminAdmin: boolean;
}

export default function useGetUserInfo(): useGetUserInfo {
  const { user: user2 } = useAuth();
  const [user, setUser] = useState<UserAccountData | null>(null);
  const [lang, setLang] = useState<string | undefined | null>('en');

  const getUser = async () => {
    const accounts = await getValueStorage('accounts');
    const account: UserAccountData = JSON.parse(accounts || '');
    setUser(account);
  };

  const isAdmin = user?.user.accountRole === 'admin';
  const isAdminAdmin = user?.user.accountRole === 'admin' && user2?.auth.role === 'admin';

  const getLang = async () =>
    await getValueStorage('language').then((e) => {
      setLang(e);
    });

  const onChangeLang = (languageCode: string) => {
    setValueStorage('language', languageCode);
    i18n.changeLanguage(languageCode);
  };

  const refreshUserInfo = useCallback(() => {
    getLang();
    getUser();
  }, []);

  useEffect(() => {
    getLang();
    getUser();
  }, []);

  return { user, isAdmin, isAdminAdmin, lang, onChangeLang, refreshUserInfo };
}
