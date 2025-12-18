import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import React, { ReactNode } from 'react';
import Toast, {
  ErrorToast,
  SuccessToast,
  ToastShowParams,
} from 'react-native-toast-message';
import { Portal } from 'react-native-paper';

interface IScreenLayout {
  children: ReactNode;
}

const toastConfig = {
  success: (props: ToastShowParams) => <SuccessToast {...props} text2NumberOfLines={4} />,
  error: (props: ToastShowParams) => <ErrorToast {...props} text2NumberOfLines={4} />,
};

export default function ScreenLayout({ children }: IScreenLayout) {
  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      <SafeAreaView style={styles.subMain}>
        <Portal>
          <View style={{ zIndex: 1000 }}>
            <Toast config={toastConfig} />
          </View>
        </Portal>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  subMain: {
    flex: 1,
  },
});
