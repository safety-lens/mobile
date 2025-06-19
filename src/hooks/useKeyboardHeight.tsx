import { Keyboard } from 'react-native';
import { useEffect, useState } from 'react';

export default function useKeyboardHeight() {
  const [keyboardStatus, setKeyboardStatus] = useState<'hidden' | 'shown'>('hidden');

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', () => {
      setKeyboardStatus('shown');
    });
    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardStatus('hidden');
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return { keyboardStatus };
}
