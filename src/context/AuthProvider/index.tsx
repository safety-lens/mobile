import { getValueStorage } from '@/utils/storage';
import React, {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

type AuthContextType = {
  isUserLoading?: boolean;
  user: { [key: string]: any } | null;
  setUser: Dispatch<SetStateAction<{ [key: string]: unknown } | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

const AuthProvider = (props: { children: ReactNode }): ReactElement => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ [key: string]: unknown } | null>(null);

  const checkAuth = async () => {
    const auth = await getValueStorage('auth');
    setIsLoading(false);
    if (!auth) {
      setUser(null);
      // router.navigate('/');
    } else {
      setUser({ auth: JSON.parse(auth) });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      {...props}
      value={{ isUserLoading: isLoading, user, setUser }}
    />
  );
};

export { AuthProvider, useAuth };
