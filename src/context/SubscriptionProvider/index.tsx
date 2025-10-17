import useModal, { UseModal } from '@/hooks/useModal';
import { getValueStorage } from '@/utils/storage';
import {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Subscription, SubscriptionFeatures, UserAccountData } from '@/axios/api/auth';

type SubscriptionContextValue = {
  hasSubscription: boolean | null;
  hasSubscriptionFeature: (feature: keyof SubscriptionFeatures) => boolean;
  subscriptionModal: UseModal;
  subscription: Subscription | null;
  subscriptionFeatures: SubscriptionFeatures | null;
};

type SubscriptionActionContextValue = {
  setSubscription: Dispatch<SetStateAction<Subscription | null>>;
  setSubscriptionFeatures: Dispatch<SetStateAction<SubscriptionFeatures | null>>;
  /**
   *
   * @todo remove this after implementing reactive storage or event emitter
   */
  syncSubscriptionData: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(
  undefined
);
const SubscriptionActionContext = createContext<
  SubscriptionActionContextValue | undefined
>(undefined);

function useSubscription(): SubscriptionContextValue {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within an SubscriptionProvider');
  }
  return context;
}

function useSubscriptionActions(): SubscriptionActionContextValue {
  const context = useContext(SubscriptionActionContext);
  if (!context) {
    throw new Error(
      'useSubscriptionActions must be used within an SubscriptionActionProvider'
    );
  }
  return context;
}

type Props = {
  children: ReactNode;
};

const ACTIVE_STATUSES = ['active', 'trialing'];

const SubscriptionProvider = ({ children }: Props): ReactElement => {
  const subscriptionModal = useModal();

  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionFeatures, setSubscriptionFeatures] =
    useState<SubscriptionFeatures | null>(null);
  const [isAdminAdmin, setIsAdminAdmin] = useState(false);

  const syncSubscriptionData = useCallback(async () => {
    // TODO: use reactive storage or event emitter instead of async storage
    const accounts = await getValueStorage('accounts');
    let data: UserAccountData | null = null;
    try {
      data = accounts ? JSON.parse(accounts) : null;
    } catch (e) {
      console.log('Error parsing accounts from async storage', e);
    }

    if (!data) {
      setIsLoading(true);
      setSubscription(null);
      return;
    }

    setIsLoading(false);
    setIsAdminAdmin(data.user.accountRole === 'admin' && data.user.role === 'admin');
    setSubscription(data.subscription as Subscription | null);
    setSubscriptionFeatures(data.subscriptionFeatures as SubscriptionFeatures | null);
  }, []);

  const hasSubscriptionFeature = useCallback(
    (feature: keyof SubscriptionFeatures) => {
      if (isAdminAdmin) return true;
      if (!subscriptionFeatures) return false;
      return subscriptionFeatures[feature];
    },
    [isAdminAdmin, subscriptionFeatures]
  );

  useEffect(() => {
    syncSubscriptionData();
  }, [syncSubscriptionData]);

  const hasSubscription =
    (isLoading ? null : ACTIVE_STATUSES.includes(subscription?.status || '')) ||
    isAdminAdmin;

  const subscriptionContextValue = useMemo(
    () => ({
      hasSubscription,
      hasSubscriptionFeature,
      subscriptionModal,
      subscription,
      subscriptionFeatures,
    }),
    [
      hasSubscription,
      hasSubscriptionFeature,
      subscriptionModal,
      subscription,
      subscriptionFeatures,
    ]
  );

  const subscriptionActionContextValue = useMemo(
    () => ({
      setSubscription,
      setSubscriptionFeatures,
      syncSubscriptionData,
    }),
    [setSubscription, setSubscriptionFeatures, syncSubscriptionData]
  );

  return (
    <SubscriptionContext.Provider value={subscriptionContextValue}>
      <SubscriptionActionContext.Provider value={subscriptionActionContextValue}>
        {children}
      </SubscriptionActionContext.Provider>
    </SubscriptionContext.Provider>
  );
};

export { SubscriptionProvider, useSubscription, useSubscriptionActions };
