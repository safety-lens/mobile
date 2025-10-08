import { getValueStorage } from '@/utils/storage';
import {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

// subscription
// {
//     productName: String,
//     accountId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Account',
//       required: true,
//     },
//     productId: {
//       type: String,
//       required: true,
//     },
//     stripeSubscriptionId: {
//       type: String,
//       required: true,
//     },
//     startDate: {
//       type: Date,
//       required: true,
//     },
//     finishDate: {
//       type: Date,
//     },
//     nextPaymentDate: {
//       type: Date,
//     },
//     status: {
//       type: String,
//       enum: [
//         'trialing',
//         'active',
//         'canceled',
//         'incomplete',
//         'incomplete_expired',
//         'past_due',
//         'unpaid',
//       ],
//       default: 'active',
//     },
//     level: Number, // 0 - canceled 1 2 3 - active
//   },
// TODO: check type!!
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

//subscription features

// {
//     projectsAndObservations: false,
//     getNotifications: false,
//     createNotifications: false,
//     chatWithAi: false,
//     report: false,
//     teamInvitations: false,
//   }
// TODO: check type!!
interface SubscriptionFeatures {
  projectsAndObservations: boolean;
  getNotifications: boolean;
  createNotifications: boolean;
  chatWithAi: boolean;
  report: boolean;
  teamInvitations: boolean;
}

type SubscriptionContextValue = {
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

const SubscriptionProvider = ({ children }: Props): ReactElement => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionFeatures, setSubscriptionFeatures] =
    useState<SubscriptionFeatures | null>(null);

  const syncSubscriptionData = async () => {
    // TODO: use reactive storage or event emitter instead of async storage
    const accounts = await getValueStorage('accounts');
    const data = JSON.parse(accounts || '');

    if (!data) {
      setSubscription(null);
      return;
    }

    const { subscription, subscriptionFeatures } = data as {
      subscription: Subscription | null;
      subscriptionFeatures: SubscriptionFeatures;
    };

    setSubscription(subscription);
    setSubscriptionFeatures(subscriptionFeatures);
  };

  useEffect(() => {
    syncSubscriptionData();
  }, []);

  return (
    <SubscriptionContext.Provider value={{ subscription, subscriptionFeatures }}>
      <SubscriptionActionContext.Provider
        value={{ setSubscription, setSubscriptionFeatures, syncSubscriptionData }}
      >
        {children}
      </SubscriptionActionContext.Provider>
    </SubscriptionContext.Provider>
  );
};

export { SubscriptionProvider, useSubscription, useSubscriptionActions };
