import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getValueStorage } from '@/utils/storage';
import { useTranslation } from 'react-i18next';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Hint({
  show,
  coordinate,
}: {
  show: boolean;
  coordinate: { x: number; y: number };
}) {
  const { t } = useTranslation();
  const [isShow, setShow] = useState(show);

  const getPositionStyle = () => {
    switch (true) {
      case coordinate.y < 0.14:
        return styles.bottom;
      case coordinate.y > 0.89:
        return styles.top;
      case coordinate.x < 0.14:
        return styles.right;
      case coordinate.x > 0.89:
        return styles.left;
      default:
        return styles.bottom;
    }
  };

  const checkShow = async () => {
    const showTip = await getValueStorage('showTip');
    if (showTip === 'true') {
      setShow(false);
    }
  };

  useEffect(() => {
    checkShow();
    setShow(show);
  }, [show]);

  // AsyncStorage.removeItem('showTip');

  return (
    isShow && (
      <View style={[styles.tipBox, getPositionStyle()]}>
        <Text style={styles.tipText}>{t('tapExpandMore')}</Text>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  tipBox: {
    backgroundColor: 'rgba(97, 97, 97, 0.9)',
    borderRadius: 4,
    padding: 4,
    position: 'absolute',
    width: 60,
    left: -20,
    zIndex: 1,
  },
  tipText: {
    fontSize: 8,
    textAlign: 'center',
    color: 'white',
  },
  bottom: {
    top: 20,
    left: -20,
  },
  left: {
    top: -4,
    left: -63,
  },
  right: {
    top: -2,
    left: 23,
  },
  top: {
    top: -30,
  },
});
