import { Alert, StyleSheet, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { StatusTitle } from '@/types/observation';
import Pin from './pin';
import { pinType } from '.';
import { determineOverallStatus } from '@/utils/determineOverallStatus';
import Hint from '../tip/Hint';
import { setValueStorage } from '@/utils/storage';

export interface IPin {
  x: number;
  y: number;
  id: number;
  status?: StatusTitle | 'mix';
  count?: number;
  type?: 'project' | 'observation';
}

interface IPinRender {
  pinType?: pinType;
  pinData: IPin[];
  imageMap?: string;
  label?: string;
  editable?: boolean;
  imageSize?: { width: number; height: number };
  currentScale: number;
  pin?: IPin | null;
  handleOnePressPin?: ({ x, y }: { x: number; y: number }) => void;
}

export default function RenderedPins({
  pin,
  pinData,
  editable = true,
  imageSize = { width: 0, height: 0 },
  currentScale = 1,
  handleOnePressPin,
}: IPinRender) {
  const [pins, setPins] = useState<IPin[]>([]);

  const removePin = (id: number) => {
    setPins((prevPins) => prevPins.filter((pin) => pin.id !== id));
  };

  const handleDoublePressPin = (id: number) => {
    Alert.alert(
      'Remove Pin',
      'Do you want to remove this pin?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => removePin(id),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const groupPins = () => {
    const threshold = 0.05;
    const groups: IPin[][] = [];

    for (const pin of pins) {
      let foundGroup = false;

      for (const group of groups) {
        if (
          group.some(
            (existingPin) =>
              Math.abs(pin.x - existingPin.x) < threshold &&
              Math.abs(pin.y - existingPin.y) < threshold
          )
        ) {
          group.push(pin);
          foundGroup = true;
          break;
        }
      }

      if (!foundGroup) {
        groups.push([pin]);
      }
    }

    return groups.map((group) => ({
      id: group[0].id,
      x: group.reduce((sum, p) => sum + p.x, 0) / group.length,
      y: group.reduce((sum, p) => sum + p.y, 0) / group.length,
      status: determineOverallStatus(group),
      count: group.length,
      type: group[0].type,
    }));
  };

  const getPins = () => {
    if (currentScale > 2) {
      return pins;
    } else {
      return groupPins();
    }
  };

  const setHandleOnePressPin = async ({ x, y }: { x: number; y: number }) => {
    handleOnePressPin?.({ x, y });
    await setValueStorage('showTip', 'true');
  };

  const allPins = pin ? [...getPins(), pin] : getPins();

  const renderedPins = useMemo(
    () =>
      allPins.map((pin, index) => (
        <View
          key={index}
          style={[
            styles.pin,
            {
              left: pin.x * imageSize.width - 10,
              top: pin.y * imageSize.height - 10,
            },
          ]}
        >
          <Pin
            count={pin.count}
            currentScale={currentScale}
            type={pin.type}
            status={pin.status}
            handleOneTap={() => setHandleOnePressPin({ x: pin.x, y: pin.y })}
          />
          <Hint show={(pin.count ?? 0) > 1} coordinate={{ x: pin.x, y: pin.y }} />
        </View>
      )),
    [pins, imageSize, editable, handleDoublePressPin]
  );

  useEffect(() => {
    if (pinData.length) {
      setPins(pinData);
    } else {
      setPins([]);
    }
  }, [pinData]);

  useEffect(() => {
    if (pin?.x) setPins(pinData);
  }, [pin?.x]);

  return renderedPins;
}

const styles = StyleSheet.create({
  pin: {
    position: 'absolute',
  },
});
