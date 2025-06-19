import { getValueStorage, setValueStorage } from '@/utils/storage';

type IData = {
  password: string;
  email: string;
};

export default function useRememberMe() {
  const saveAutData = async ({ password, email }: IData) => {
    const data = JSON.stringify({ password, email });
    setValueStorage('authData', data);
  };
  const getAutData = async (): Promise<IData> => {
    const auth = await getValueStorage('authData');
    const authParse: IData = auth ? JSON.parse(auth) : ({} as IData);
    return authParse;
  };
  return { saveAutData, getAutData };
}
