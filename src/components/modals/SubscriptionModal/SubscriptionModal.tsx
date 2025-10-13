import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from '@/modal';
import { useSubscription } from '@/context/SubscriptionProvider';
import { Typography } from '@/components/Typography';
import CustomButton from '@/components/CustomButton/button';
import { useTranslation } from 'react-i18next';
import IconClose from '../../../../assets/svgs/iconClose';

const SubscriptionModal = () => {
  const { subscriptionModal } = useSubscription();
  const { t } = useTranslation();
  return (
    <Modal visible={subscriptionModal.isVisible} hideModal={subscriptionModal.hide}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography preset="title" fullWidth={false}>
            {t('upgradeYourPlan')}
          </Typography>
          <TouchableOpacity onPress={subscriptionModal.hide}>
            <IconClose />
          </TouchableOpacity>
        </View>
        <Typography size="sm" fullWidth>
          {t('pleaseUpgradeYourPlanToUseThisFeature')}
        </Typography>
        <CustomButton
          padding={4}
          onPress={subscriptionModal.hide}
          title={t('continue')}
        />
      </View>
    </Modal>
  );
};

export default SubscriptionModal;

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
