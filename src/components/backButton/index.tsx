import { TouchableOpacity } from 'react-native';
import React from 'react';
import { Href, router } from 'expo-router';
import ArrowIcon from '../../../assets/svgs/arrowIcon';

type BackButtonProps = {
  backPath?: Href;
  backPathOnClick?: () => void;
  isRoutable?: boolean;
  padding?: number;
};

const DEFAULT_PADDING = 10;

export default function BackButton({
  backPath,
  backPathOnClick,
  isRoutable = true,
  padding = DEFAULT_PADDING,
}: BackButtonProps) {
  const back = (path: Href | undefined) => {
    backPathOnClick?.();
    if (!isRoutable) return;
    if (path) {
      router.navigate(path);
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.navigate('/auth/projects');
      }
    }
  };
  return (
    <TouchableOpacity
      style={{
        padding,
      }}
      onPress={() => back(backPath)}
    >
      <ArrowIcon />
    </TouchableOpacity>
  );
}
