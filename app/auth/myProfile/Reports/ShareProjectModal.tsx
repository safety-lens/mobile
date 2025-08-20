import Modal from '@/modal';
import React from 'react';

import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import IconClose from '../../../../assets/svgs/iconClose';
import CustomButton from '@/components/CustomButton/button';
import { RadioButton } from 'react-native-paper';
import { TChecked } from './DownloadModal';
import { useTranslation } from 'react-i18next';

export default function ShareProjectModal({
  visible,
  hideModal,
  projectName,
  handleSharePdf,
  isLoadingReportShare,
}: {
  visible: boolean;
  hideModal: () => void;
  projectName: string;
  handleSharePdf: (email: string, message: string, format: TChecked) => void;
  isLoadingReportShare?: boolean;
}) {
  const { t } = useTranslation();
  const [email, setEmail] = React.useState('oleh@springsapps.com');
  const [message, setMessage] = React.useState('');
  const [checked, setChecked] = React.useState<TChecked>('PDF');

  const handleShare = () => {
    handleSharePdf(email, message, checked);
  };

  return (
    <Modal visible={visible} hideModal={hideModal}>
      <>
        <View style={styles.header}>
          <Text style={styles.title}>
            {t('share')} &quot;{projectName}&quot;
          </Text>
          <TouchableOpacity onPress={hideModal}>
            <IconClose />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View>
            <Text>{t('shareThisDocumentTo')}</Text>
            <TextInput style={styles.inputField} value={email} onChangeText={setEmail} />
          </View>

          <Text style={{ marginTop: 24 }}>{t('selectTheFormatForYourReport')}</Text>
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

          <View style={{ marginTop: 24 }}>
            <Text>{t('messageOptional')}</Text>
            <TextInput
              style={styles.inputField}
              value={message}
              onChangeText={setMessage}
            />
          </View>
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
            title={t('share')}
            disabled={!email || isLoadingReportShare}
            onPress={handleShare}
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
    gap: 32,
    marginTop: 12,
  },
  radioButton: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  inputField: {
    marginTop: 8,
    height: 40,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    color: 'black',
  },
  footer: {
    marginTop: 20,
    gap: 12,
    flexDirection: 'row',
  },
});
