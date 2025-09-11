import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from '@/modal';
import CustomButton from '@/components/CustomButton/button';
import { IGetAllCategory, useApiObservations } from '@/axios/api/observations';
import { Observation } from '@/types/observation';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import IconClose from '../../../../../assets/svgs/iconClose';
import MultiSelectDropdown from '@/components/MultiSelectDropdown';

interface IChangeCategories {
  visible: boolean;
  hideModal: () => void;
  observationId: string;
  returnSameStatus?: Observation | boolean;
  defaultValue?: string[];
}

export default function ChangeCategories({
  visible = false,
  hideModal,
  observationId,
  returnSameStatus,
  defaultValue,
}: IChangeCategories) {
  const {
    updateObservations,
    getAllCategory,
    getFilterObservations,
    getAllObservations,
  } = useApiObservations();

  const { t } = useTranslation();

  const [category, setCategory] = useState<IGetAllCategory[]>([]);
  const [text, setText] = useState<string>('');
  const [textError, setTextError] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  console.log(textError);

  const onSubmit = async () => {
    if (selectedCategory.length === 0) {
      if (!text) {
        setTextError(true);
        return;
      }
    }
    await updateObservations({
      observationId,
      data: {
        categories: selectedCategory,
        implementedActions: text || undefined,
      },
    }).then(async () => {
      Toast.show({
        type: 'success',
        text1: t('success'),
        text2: t('observationUpdate'),
      });
      if (returnSameStatus as Observation) {
        await getFilterObservations({
          status: (returnSameStatus as Observation).status,
          projectId: (returnSameStatus as Observation).projectId,
        });
      } else {
        await getAllObservations({});
      }
      // setStatusFilter((returnSameStatus as Observation).status);
      setSelectedCategory([]);
      hideModal();
    });
  };

  useEffect(() => {
    setText('');
    setTextError(false);
  }, [selectedCategory]);

  useEffect(() => {
    getAllCategory().then((res) => setCategory(res || []));
  }, []);

  console.log(
    'defaultValue',
    defaultValue?.map((item) => item)
  );

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
            data={category.map((item) => ({
              label: item.specification,
              id: item.name,
              name: item.name,
            }))}
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
  textBox: {
    marginTop: 24,
    gap: 8,
  },
  textTitle: {
    color: '#0A2540',
    fontSize: 17,
    fontWeight: '500',
  },
  textInput: {
    height: 100,
    borderColor: '#D0D5DD',
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    backgroundColor: 'white',
  },
  buttonBox: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 8,
  },
  error: {
    borderColor: 'red',
    color: 'red',
  },
});
