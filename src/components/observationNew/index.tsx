import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CreateNewObservation from '../createNewObservation';
import { useTranslation } from 'react-i18next';
import { Menu } from 'react-native-paper';
import useTakeImage from '@/hooks/useTakeImage';
import CustomButton from '../CustomButton/button';
import EyeObservation from '../../../assets/svgs/eye';
import useModal from '@/hooks/useModal';
import { useSubscription } from '@/context/SubscriptionProvider';

interface INewObservation {
  onChange?: (e: ImagePicker.ImagePickerAsset) => void;
  clearMessages?: () => void;
  loadedObservationImage?: string;
}

export default function NewObservation({
  onChange,
  clearMessages,
  loadedObservationImage,
}: INewObservation) {
  const { t } = useTranslation();
  const { hasSubscriptionFeature, subscriptionModal } = useSubscription();
  const { pickImage, takePhoto } = useTakeImage();

  const createObservationModal = useModal();
  const menu = useModal();

  const openVisibleMenu = useCallback(() => {
    if (!hasSubscriptionFeature('projectsAndObservations')) {
      subscriptionModal.show();
      return;
    }
    if (onChange) {
      menu.toggle();
    } else {
      createObservationModal.show();
    }
  }, [hasSubscriptionFeature, onChange, subscriptionModal, menu, createObservationModal]);

  const triggerFunc = () => {
    if (onChange) {
      pickImage(onChange);
      openVisibleMenu();
    } else {
      createObservationModal.show();
    }
  };
  const triggerFuncCamera = () => {
    if (onChange) {
      takePhoto(onChange);
      openVisibleMenu();
    } else {
      createObservationModal.show();
    }
  };

  return (
    <>
      <Menu
        anchorPosition="bottom"
        contentStyle={styles.menuContentStyle}
        style={styles.menu}
        visible={menu.isVisible}
        onDismiss={openVisibleMenu}
        anchor={
          <CustomButton
            styleAppBtn={{
              minWidth: 190,
            }}
            onPress={openVisibleMenu}
            icon={<EyeObservation />}
            title={!loadedObservationImage ? t('newObservation') : t('postObservation')}
          />
        }
      >
        <Menu.Item
          titleStyle={styles.menuItem}
          onPress={triggerFunc}
          title={t('uploadFromLibrary')}
        />
        <Menu.Item
          titleStyle={styles.menuItem}
          onPress={triggerFuncCamera}
          title={t('takePhoto')}
        />
      </Menu>
      <CreateNewObservation
        loadedObservationImage={loadedObservationImage}
        title={t('createNewObservation')}
        visible={createObservationModal.isVisible}
        hideModal={createObservationModal.hide}
        clearMessages={clearMessages}
      />
    </>
  );
}

const styles = StyleSheet.create({
  menuContentStyle: {
    backgroundColor: 'white',
    borderRadius: 8,
  },
  menu: {
    paddingTop: 10,
  },
  menuItem: {
    color: 'black',
  },
});
