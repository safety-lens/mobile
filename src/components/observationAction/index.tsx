import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCallback } from 'react';
import { Menu } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import useGetUserInfo from '@/hooks/getUserInfo';
import { useSubscription } from '@/context/SubscriptionProvider';
import useModal from '@/hooks/useModal';
import { useObservationActionModals } from '@/context/ObservationActionModalsProvider';
import { Observation } from '@/types/observation';

type Props = {
  observation: Observation;
  onClose?: () => void;
};

export default function ObservationAction({ observation, onClose }: Props) {
  const { t } = useTranslation();
  const { hasSubscriptionFeature } = useSubscription();
  const { isAdmin } = useGetUserInfo();

  const menu = useModal();

  const {
    renameModal,
    removeModal,
    changeStatusModal,
    editCommentModal,
    changeAssigneeModal,
    changeDeadlineModal,
    changeCategoriesModal,
    setObservation,
  } = useObservationActionModals();

  const handleChangeStatusPress = useCallback(() => {
    setObservation(observation);
    changeStatusModal.show();
    menu.hide();
  }, [changeStatusModal, menu, observation, setObservation]);

  const handleRenamePress = useCallback(() => {
    setObservation(observation);
    renameModal.show();
    menu.hide();
  }, [observation, setObservation, renameModal, menu]);

  const handleRemovePress = useCallback(() => {
    setObservation(observation);
    removeModal.show();
    menu.hide();
  }, [observation, setObservation, removeModal, menu]);

  const handleEditCommentPress = useCallback(() => {
    setObservation(observation);
    editCommentModal.show();
    menu.hide();
  }, [editCommentModal, menu, observation, setObservation]);

  const handleChangeAssigneePress = useCallback(() => {
    setObservation(observation);
    changeAssigneeModal.show();
    menu.hide();
  }, [changeAssigneeModal, menu, observation, setObservation]);

  const handleChangeDeadlinePress = useCallback(() => {
    setObservation(observation);
    changeDeadlineModal.show();
    menu.hide();
  }, [changeDeadlineModal, menu, observation, setObservation]);

  const handleChangeCategoriesPress = useCallback(() => {
    setObservation(observation);
    changeCategoriesModal.show();
    menu.hide();
  }, [changeCategoriesModal, menu, observation, setObservation]);

  return (
    <View>
      <Menu
        contentStyle={styles.menuContentStyle}
        style={styles.menu}
        visible={menu.isVisible}
        onDismiss={menu.hide}
        anchor={
          <TouchableOpacity onPress={menu.toggle} style={styles.dotsBox}>
            <Text style={styles.dots}>...</Text>
          </TouchableOpacity>
        }
      >
        <Menu.Item
          titleStyle={styles.menuItem}
          onPress={handleRenamePress}
          title={t('rename')}
        />
        <Menu.Item
          titleStyle={styles.menuItem}
          onPress={handleEditCommentPress}
          title={t('editComment')}
        />
        <Menu.Item
          titleStyle={styles.menuItem}
          onPress={handleChangeStatusPress}
          title={t('changeStatus')}
        />
        {hasSubscriptionFeature('teamInvitations') && isAdmin && (
          <Menu.Item
            titleStyle={styles.menuItem}
            onPress={handleChangeDeadlinePress}
            title={t('changeDeadline')}
          />
        )}
        <Menu.Item
          title={t('changeCategories')}
          titleStyle={styles.menuItem}
          onPress={handleChangeCategoriesPress}
        />
        {hasSubscriptionFeature('teamInvitations') && (
          <Menu.Item
            title={t('changeAssignee')}
            titleStyle={styles.menuItem}
            onPress={handleChangeAssigneePress}
          />
        )}
        <Menu.Item
          titleStyle={styles.menuItem}
          onPress={handleRemovePress}
          title={t('delete')}
        />
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  dotsBox: {
    paddingHorizontal: 10,
  },
  dots: {
    fontWeight: '900',
    fontSize: 30,
    marginTop: -18,
    color: Colors.light.text,
  },
  menuContentStyle: {
    backgroundColor: 'white',
    borderRadius: 8,
  },
  menu: {
    paddingTop: 25,
  },
  menuItem: {
    color: 'black',
  },
});
