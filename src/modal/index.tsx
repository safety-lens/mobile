import useKeyboardHeight from '@/hooks/useKeyboardHeight';
import React, { useRef } from 'react';
import { Animated, Platform, ScrollView } from 'react-native';
import { Modal as ModalWindow, Portal } from 'react-native-paper';

interface IModal {
  visible: boolean;
  hideModal: (() => void) | undefined;
  children?: React.JSX.Element | null;
  keyboardUp?: boolean;
}

const customTheme = {
  colors: {
    backdrop: 'rgba(2, 33, 64, 0.85)',
  },
};

export default function Modal({
  visible = false,
  keyboardUp,
  hideModal,
  children,
}: IModal) {
  const { keyboardStatus } = useKeyboardHeight();
  const animatedHeight = useRef(new Animated.Value(0)).current;

  Animated.timing(animatedHeight, {
    toValue: keyboardUp ? (keyboardStatus === 'shown' ? -140 : 0) : 0,
    duration: 100,
    useNativeDriver: false,
  }).start();

  return (
    <Portal>
      <ModalWindow visible={visible} onDismiss={hideModal} theme={customTheme}>
        <Animated.View style={{ top: Platform.OS === 'ios' ? animatedHeight : 0 }}>
          <ScrollView
            style={{
              margin: 20,
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 16,
            }}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </ModalWindow>
    </Portal>
  );
}
