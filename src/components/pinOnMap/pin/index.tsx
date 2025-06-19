import React, { useState } from 'react';
import PinSvg from '../../../../assets/svgs/pin';
import { Platform, StyleSheet, TouchableWithoutFeedback, View, Text } from 'react-native';
import { pinType } from '..';
// import CirclePin from '../../../../assets/svgs/pinCircle';
import { StatusTitle } from '@/types/observation';

const DOUBLE_TAP_DELAY = 300;

interface IPinComponent {
  handleDoubleTap?: () => void;
  handleOneTap?: () => void;
  type?: pinType;
  status?: StatusTitle | 'mix';
  currentScale?: number;
  count?: number | undefined;
  tip?: boolean;
}

const statusTitle = {
  'Not addressed': '#FF0D31',
  'In progress': '#FFBF00',
  Addressed: '#2C875D',
  mix: '#5C9CCD',
};

export default function Pin({
  handleDoubleTap,
  handleOneTap,
  type = 'project',
  status,
  currentScale = 1,
  count,
}: IPinComponent) {
  const translate = Platform.OS === 'ios' ? 15 : currentScale < 3 ? 15.5 : 16.5;
  const [lastTap, setLastTap] = useState<number | null>(null);
  const isCount = count && count > 1;

  const handleTap = () => {
    const now = Date.now();
    if (lastTap && now - lastTap < DOUBLE_TAP_DELAY) {
      handleDoubleTap?.();
      setLastTap(null);
    } else {
      if (isCount) {
        handleOneTap?.();
      }
      setLastTap(now);
    }
  };

  const renderPin = () => {
    if (type === 'observation') {
      return <PinSvg fill={statusTitle[(status as StatusTitle) ?? 'addressed']} />;
    } else if (type === 'project') {
      return Platform.OS === 'android' ? (
        <View
          style={[
            styles.androidCircle,
            {
              width: 20 / currentScale,
              height: 20 / currentScale,
              borderWidth: 3 / currentScale,
              backgroundColor: statusTitle[(status as StatusTitle) ?? 'addressed'],
            },
          ]}
        >
          {isCount && (
            <Text
              style={[
                styles.circleText,
                {
                  fontSize: 10 / currentScale,
                },
              ]}
            >
              {count}
            </Text>
          )}
        </View>
      ) : (
        <View
          style={[
            styles.circleParent,
            {
              width: 20 / currentScale,
              height: 20 / currentScale,
            },
          ]}
        >
          <View
            style={[
              styles.circleChild,
              {
                width: 15 / currentScale,
                height: 15 / currentScale,
                backgroundColor: statusTitle[(status as StatusTitle) ?? 'addressed'],
                transform: [
                  { translateX: -(translate / currentScale) / 2 },
                  { translateY: -(translate / currentScale) / 2 },
                ],
              },
            ]}
          >
            {isCount && (
              <Text
                style={[
                  styles.circleText,
                  {
                    fontSize: 10 / currentScale,
                  },
                ]}
              >
                {count}
              </Text>
            )}
          </View>
        </View>
      );

      // <CirclePin
      //   count={count && count > 1 ? count : undefined}
      //   width={48 / currentScale}
      //   height={58 / currentScale}
      //   fill={statusTitle[(status as StatusTitle) ?? 'addressed']}
      // />
    }
    return null;
  };

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={[styles.box, isCount ? styles.isCount : null]}>{renderPin()}</View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  androidCircle: {
    borderRadius: 100,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleParent: {
    borderRadius: 100,
    backgroundColor: 'white',
    position: 'relative',
  },
  circleChild: {
    borderRadius: 100,
    position: 'absolute',
    top: '50%',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    color: 'white',
    fontWeight: '700',
  },
  isCount: {
    padding: 20,
    width: 28,
    height: 28,
    left: -10,
    top: -10,
    borderRadius: 14,
  },
});
