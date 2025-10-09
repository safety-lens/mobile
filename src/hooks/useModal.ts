import { useState, useCallback, useMemo } from 'react';

export interface UseModal {
  isVisible: boolean;
  toggle: () => void;
  show: () => void;
  hide: () => void;
}

export default function useModal(initialState = false): UseModal {
  const [isVisible, setIsVisible] = useState(initialState);

  const toggle = useCallback(() => setIsVisible((prev) => !prev), []);
  const show = useCallback(() => setIsVisible(true), []);
  const hide = useCallback(() => setIsVisible(false), []);

  const result = useMemo(
    () => ({ isVisible, toggle, show, hide }),
    [isVisible, toggle, show, hide]
  );
  return result;
}
