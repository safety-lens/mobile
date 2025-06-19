import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BackButton from '../backButton';
import { Href } from 'expo-router';
import { Colors } from '@/constants/Colors';

interface IScreenTopNav {
  title?: string;
  backPath?: Href;
  logoLeft?: React.JSX.Element;
  icon?: React.JSX.Element;
  backPathOnClick?: () => void;
  isRoutable?: boolean;
}

export default function ScreenTopNav({
  icon,
  title,
  backPath = undefined,
  logoLeft,
  backPathOnClick,
  isRoutable,
}: IScreenTopNav) {
  return (
    <View style={styles.screenTopNav}>
      <View style={[styles.leftSide, logoLeft && { gap: 12 }]}>
        {(backPath || backPathOnClick) && (
          <BackButton
            backPathOnClick={backPathOnClick}
            backPath={backPath}
            isRoutable={isRoutable}
          />
        )}
        {logoLeft}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rightSide}>
        <View>{icon}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 25,
    textAlign: 'center',
    color: Colors.light.text,
  },
  screenTopNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
});
