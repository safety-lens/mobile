import Modal from '@/modal';
import React from 'react';

import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import IconClose from '../../../../assets/svgs/iconClose';
import CustomButton from '@/components/CustomButton/button';
import { RadioButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export type TChecked = 'PDF' | 'XLS' | 'CSV';

export default function DownloadModal({
  visible,
  hideModal,
  projectName,
  createPdf,
  createXLS,
  createCSV,
}: {
  visible: boolean;
  hideModal: () => void;
  projectName: string;
  createPdf: () => void;
  createXLS: () => void;
  createCSV: () => void;
}) {
  const { t } = useTranslation();
  const [checked, setChecked] = React.useState<TChecked>('PDF');

  const handleDownload = () => {
    if (checked === 'PDF') {
      createPdf();
    } else if (checked === 'XLS') {
      createXLS();
    } else if (checked === 'CSV') {
      createCSV();
    }
    hideModal();
  };

  return (
    <Modal visible={visible} hideModal={hideModal}>
      <>
        <View style={styles.header}>
          <Text style={styles.title}>
            {t('downloadReport')} &quot;{projectName}&quot;
          </Text>
          <TouchableOpacity onPress={hideModal}>
            <IconClose />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text>{t('pleaseChooseFormat')}</Text>
          <RadioButton.Group
            value={checked}
            onValueChange={(value) => setChecked(value as TChecked)}
          >
            <View style={styles.radioButtonContainer}>
              <View style={styles.radioButton}>
                <RadioButton.Android color="black" value="PDF" />
                <Text>PDF</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton.Android color="black" value="XLS" />
                <Text>XLS</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton.Android color="black" value="CSV" />
                <Text>CSV</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>

        <View style={styles.footer}>
          <CustomButton
            styleAppBtn={{
              width: 100,
              borderWidth: 1,
              borderColor: 'grey',
              flex: 1,
            }}
            backgroundColor="white"
            styleBtn={{ color: 'black' }}
            title={t('back')}
            onPress={hideModal}
          />
          <CustomButton
            styleAppBtn={{ flex: 1 }}
            title={t('download')}
            onPress={handleDownload}
          />
        </View>
      </>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A2540',
  },
  content: {
    marginTop: 20,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 24,
  },
  radioButton: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  footer: {
    marginTop: 20,
    gap: 12,
    flexDirection: 'row',
  },
});
