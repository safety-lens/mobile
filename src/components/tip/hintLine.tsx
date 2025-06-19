import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import Pin from '../pinOnMap/pin';
import { useTranslation } from 'react-i18next';
import { getValueStorage, setValueStorage } from '@/utils/storage';

export default function HintLine({ scale }: { scale: number }) {
  const { t } = useTranslation();
  const [first, setFirst] = useState(false);

  const checkShow = async () => {
    const showTip = await getValueStorage('showTip');
    if (scale === 5) {
      await setValueStorage('showTip', 'true');
    }
    if (showTip === 'true') {
      setFirst(false);
    } else {
      setFirst(true);
    }
  };

  useEffect(() => {
    checkShow();
  }, [scale]);

  return (
    !first && (
      <View style={styles.container}>
        <View style={styles.tipsBox}>
          <Pin status={'Addressed'} />
          <Text style={styles.tipsText}>{t('addressed')}</Text>
        </View>
        <View style={styles.tipsBox}>
          <Pin status={'In progress'} />
          <Text style={styles.tipsText}> {t('inProgress')}</Text>
        </View>
        <View style={styles.tipsBox}>
          <Pin status={'Not addressed'} />
          <Text style={styles.tipsText}>{t('notAddressed')}</Text>
        </View>
        <View style={styles.tipsBox}>
          <Pin status={'mix'} />
          <Text style={styles.tipsText}>{t('mix')}</Text>
        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9F9F9',
    paddingTop: 6,
    paddingBottom: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tipsBox: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  tipsText: {
    fontSize: 12,
  },
});
