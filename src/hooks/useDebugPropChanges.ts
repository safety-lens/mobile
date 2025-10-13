/* eslint-disable no-console */
import { useEffect, useRef } from 'react';

function logPropDifferences(
  newProps: Record<string, any>,
  lastProps: Record<string, any>
) {
  const allKeys = new Set(Object.keys(newProps));
  Object.keys(lastProps).forEach((key) => {
    allKeys.add(key);
  });
  allKeys.forEach((key) => {
    const newValue = newProps[key];
    const lastValue = lastProps[key];
    if (newValue !== lastValue) {
      console.log('New Value: ', key, ' - ', newValue);
      console.log('Last Value: ', key, ' - ', lastValue);
    }
  });
}

export function useDebugPropChanges(id: any, newProps: Record<string, any>) {
  const lastProps = useRef<Record<string, any>>(null);
  // Should only run when the component re-mounts
  useEffect(() => {
    console.log('Mounted', id);
  }, [id]);
  if (lastProps.current) {
    console.log('Rerendered', id);
    logPropDifferences(newProps, lastProps.current);
  }
  // @ts-ignore
  lastProps.current = newProps;
}
