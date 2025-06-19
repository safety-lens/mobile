import { TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { Href, router } from 'expo-router';
import ArrowIcon from '../../../assets/svgs/arrowIcon';

export default function BackButton({
  backPath,
  backPathOnClick,
  isRoutable = true,
}: {
  backPath?: Href | undefined;
  backPathOnClick?: () => void;
  isRoutable?: boolean;
}) {
  const back = (backPath: Href | undefined) => {
    backPathOnClick?.();
    if (!isRoutable) return;
    if (backPath) {
      router.navigate(backPath as Href);
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.navigate('/auth/projects');
      }
    }
  };
  return (
    <TouchableOpacity style={styles.buttonBox} onPress={() => back(backPath)}>
      <ArrowIcon />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBox: {
    paddingRight: 20,
    paddingVertical: 10,
  },
});
