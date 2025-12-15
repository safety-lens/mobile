import Modal from '@/modal';
import React, { useCallback, useEffect } from 'react';

import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import IconClose from '../../../../assets/svgs/iconClose';
import CustomButton from '@/components/CustomButton/button';
import { RadioButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { GenerateReportFunction } from '@/hooks/useGenerateReport';

export type TChecked = 'PDF' | 'XLS' | 'CSV';

export default function DownloadModal({
  visible,
  hideModal,
  projectName,
  createPdf,
  createXLS,
  createCSV,
  dateRange,
}: {
  visible: boolean;
  hideModal: () => void;
  projectName: string;
  createPdf: GenerateReportFunction;
  createXLS: GenerateReportFunction;
  createCSV: GenerateReportFunction;
  dateRange: string;
}) {
  const { t } = useTranslation();
  const [checked, setChecked] = React.useState<TChecked>('PDF');
  const [loading, setLoading] = React.useState(false);

  const resetState = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    resetState();
  }, [resetState, visible]);

  const handleDownload = useCallback(async () => {
    setLoading(true);
    if (checked === 'PDF') {
      await createPdf();
    } else if (checked === 'XLS') {
      await createXLS();
    } else if (checked === 'CSV') {
      await createCSV();
    }
    setLoading(false);
    hideModal();
  }, [checked, createPdf, createXLS, createCSV, hideModal]);

  return (
    <Modal visible={visible} hideModal={hideModal}>
      <>
        <View style={styles.header}>
          <Text style={styles.title}>
            {t('downloadReport')} &quot;{projectName} ({dateRange})&quot;
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
            loading={loading}
            disabled={loading}
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
    maxWidth: '85%',
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
    gap: 4,
    alignItems: 'center',
  },
  footer: {
    marginTop: 20,
    gap: 12,
    flexDirection: 'row',
  },
});
