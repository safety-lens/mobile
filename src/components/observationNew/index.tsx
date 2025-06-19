import React, { ReactNode, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CreateNewObservation from '../createNewObservation';
import { useTranslation } from 'react-i18next';
import { Menu } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import useTakeImage from '@/hooks/useTakeImage';
import CustomButton from '../CustomButton/button';
import EyeObservation from '../../../assets/svgs/eye';

interface INewObservation {
  onChange?: (e: ImagePicker.ImagePickerAsset) => void;
  clearMessages?: () => void;
  loadedObservationImage?: string;
  anchorChild?: (onClick: () => void) => ReactNode;
}

export default function NewObservation({
  onChange,
  clearMessages,
  loadedObservationImage,
  anchorChild,
}: INewObservation) {
  const { t } = useTranslation();
  const { pickImage, takePhoto } = useTakeImage();

  const [visible, setVisible] = useState(false);
  const [visibleMenu, setVisibleMenu] = useState(false);

  const openVisibleMenu = () => (onChange ? setVisibleMenu(!visibleMenu) : showModal());
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const triggerFunc = () => {
    if (onChange) {
      pickImage(onChange);
      openVisibleMenu();
    } else {
      showModal();
    }
  };
  const triggerFuncCamera = () => {
    if (onChange) {
      takePhoto(onChange);
      openVisibleMenu();
    } else {
      showModal();
    }
  };

  return (
    <View>
      <Menu
        anchorPosition="bottom"
        contentStyle={styles.menuContentStyle}
        style={styles.menu}
        visible={visibleMenu}
        onDismiss={openVisibleMenu}
        anchor={
          anchorChild ? (
            anchorChild(openVisibleMenu)
          ) : (
            <CustomButton
              onPress={openVisibleMenu}
              icon={<EyeObservation />}
              title={!loadedObservationImage ? t('newObservation') : t('postObservation')}
            />
          )
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
        visible={visible}
        hideModal={hideModal}
        clearMessages={clearMessages}
      />
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
    marginTop: 20,
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
