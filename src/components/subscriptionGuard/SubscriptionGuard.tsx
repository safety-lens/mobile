import React from 'react';
import { ActivityIndicator, Linking, StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useSubscription } from '@/context/SubscriptionProvider';
import { Placeholder } from '../placeholder';
import { SUBSCRIPTION_URL } from '@/constants/api';

type Props = {
  enabled?: boolean;
  children: React.ReactNode;
};

const SubscriptionGuard = ({ enabled = true, children }: Props) => {
  const { t } = useTranslation();
  const { hasSubscription } = useSubscription();

  if (!enabled) {
    return <>{children}</>;
  }

  if (hasSubscription === null) {
    return <ActivityIndicator size="large" style={styles.container} />;
  }

  if (!hasSubscription) {
    return (
      <Placeholder
        text={t('subscriptionExpired')}
        description={t('pleaseRenewYourSubscription')}
        buttonTitle="Renew Subscription"
        onPress={() => Linking.openURL(SUBSCRIPTION_URL)}
      />
    );
  }

  return <>{children}</>;
};

export default React.memo(SubscriptionGuard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
