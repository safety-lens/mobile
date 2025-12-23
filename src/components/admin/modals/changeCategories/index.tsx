import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from '@/modal';
import CustomButton from '@/components/CustomButton/button';
import { IGetAllCategory, useApiObservations } from '@/axios/api/observations';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import IconClose from '../../../../../assets/svgs/iconClose';
import MultiSelectDropdown from '@/components/MultiSelectDropdown';

interface IChangeCategories {
  visible: boolean;
  hideModal: () => void;
  observationId: string;
  onUpdate?: () => void;
  defaultValue?: string[];
}

export default function ChangeCategories({
  visible = false,
  hideModal,
  observationId,
  onUpdate,
  defaultValue,
}: IChangeCategories) {
  const { updateObservations, getAllCategory } = useApiObservations();

  const { t } = useTranslation();

  const [category, setCategory] = useState<IGetAllCategory[]>([]);
  const [text, setText] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  const onSubmit = async () => {
    if (selectedCategory.length === 0) {
      if (!text) {
        setHasError(true);
        return;
      }
    }
    const result = await updateObservations({
      observationId,
      data: {
        categories: selectedCategory,
        implementedActions: text || undefined,
      },
    });
    if (result) {
      Toast.show({
        type: 'success',
        text1: t('success'),
        text2: t('observationUpdate'),
      });
    }
    if (onUpdate) {
      onUpdate();
    }
    setSelectedCategory([]);
    hideModal();
  };

  useEffect(() => {
    setText('');
    setHasError(false);
  }, [selectedCategory]);

  useEffect(() => {
    if (visible) {
      getAllCategory().then((res) => setCategory(res || []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const categoryDropdownItems = useMemo(() => {
    return category.map((item) => ({
      value: item.name,
      label: item.name,
      description: item.specification,
    }));
  }, [category]);

  return (
    <Modal visible={visible} hideModal={hideModal} keyboardUp>
      <>
        <View style={styles.formHead}>
          <Text style={styles.formHeadText}>{t('changeCategories')}</Text>

          <TouchableOpacity onPress={hideModal}>
            <IconClose />
          </TouchableOpacity>
        </View>

        <View style={styles.dropdownItem}>
          <MultiSelectDropdown
            required
            search
            data={categoryDropdownItems}
            defaultValue={defaultValue}
            placeholderInput="chooseCategory"
            label={t('chooseCategory')}
            onChange={(selectedItems) => {
              setSelectedCategory(selectedItems as string[]);
            }}
          />
        </View>

        <View style={styles.buttonBox}>
          <CustomButton
            onPress={hideModal}
            title={t('cancelButton')}
            backgroundColor="#fff"
            styleBtn={{ color: '#000' }}
            styleAppBtn={{
              borderColor: '#D0D5DD',
              borderWidth: 1,
              borderRadius: 8,
              flex: 1,
            }}
          />
          <CustomButton
            title={t('change')}
            onPress={onSubmit}
            styleAppBtn={{
              flex: 1,
            }}
          />
        </View>
      </>
    </Modal>
  );
}

const styles = StyleSheet.create({
  formHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formHeadText: {
    color: '#0A2540',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  dropdownItem: {
    marginTop: 20,
  },
  buttonBox: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 8,
  },
});
