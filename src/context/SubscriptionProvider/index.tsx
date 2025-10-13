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
  useState,
} from 'react';
import useGetUserInfo from '@/hooks/getUserInfo';

interface Subscription {
  productName: string;
  accountId: string;
  productId: string;
  stripeSubscriptionId: string;
  startDate: string;
  finishDate?: string;
  nextPaymentDate?: string;
  status:
    | 'trialing'
    | 'active'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'past_due'
    | 'unpaid';
  level: number; // 0 - canceled, 1, 2, 3 - active
}

interface SubscriptionFeatures {
  projectsAndObservations: boolean;
  getNotifications: boolean;
  createNotifications: boolean;
  chatWithAi: boolean;
  report: boolean;
  teamInvitations: boolean;
}

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
  const { isAdminAdmin } = useGetUserInfo();

  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionFeatures, setSubscriptionFeatures] =
    useState<SubscriptionFeatures | null>(null);

  const syncSubscriptionData = useCallback(async () => {
    // TODO: use reactive storage or event emitter instead of async storage
    const accounts = await getValueStorage('accounts');
    let data;
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

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptionModal,
        hasSubscription: isLoading
          ? null
          : ACTIVE_STATUSES.includes(subscription?.status || '') || isAdminAdmin,
        hasSubscriptionFeature,
        subscription,
        subscriptionFeatures,
      }}
    >
      <SubscriptionActionContext.Provider
        value={{ setSubscription, setSubscriptionFeatures, syncSubscriptionData }}
      >
        {children}
      </SubscriptionActionContext.Provider>
    </SubscriptionContext.Provider>
  );
};

export { SubscriptionProvider, useSubscription, useSubscriptionActions };
