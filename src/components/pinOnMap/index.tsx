import React, { memo, useCallback, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  LayoutChangeEvent,
} from 'react-native';
import { OnSingleTapCallback, Zoomable } from '@likashefqet/react-native-image-zoom';
import { runOnJS, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { Observation, StatusTitle } from '@/types/observation';
import ImageBox from './imageBox';
import { useTranslation } from 'react-i18next';
import RenderedPins from './renderedPins';
// import HintLine from '../tip/hintLine';

export interface IPin {
  x: number;
  y: number;
  id: number;
  status?: StatusTitle;
  type?: 'project' | 'observation';
}

export type pinType = 'project' | 'observation';

interface IPinOnMap {
  setLocations?: (e: IPin[]) => void;
  pinType?: pinType;
  imageMap?: string;
  label?: string;
  editable?: boolean;
  observations?: Observation[] | [];
}

const PinOnMap = memo(function PinOnMap({
  setLocations,
  pinType = 'project',
  imageMap,
  label,
  editable = true,
  observations,
}: IPinOnMap) {
  const { t } = useTranslation();

  const zoomableRef = useRef<{
    zoom: ({ x, y, scale }: { x: number; y: number; scale: number }) => void;
    reset: () => void;
  } | null>(null);

  const scale = useSharedValue(1);
  const [currentScale, setCurrentScale] = useState(1);

  const [pin, setPin] = useState<IPin | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const handlePress: OnSingleTapCallback = (event) => {
    if (editable) {
      const { x, y } = event;
      const pinX = x / imageSize.width;
      const pinY = y / imageSize.height;
      setLocations?.([{ x: pinX, y: pinY, id: pinX + pinY, status: 'Not addressed' }]);
      setPin({ x: pinX, y: pinY, id: pinX + pinY, type: 'observation' });
    }
  };

  const onImageLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setImageSize({ width, height });
  };

  const showPins = useCallback((): IPin[] | [] => {
    if (observations?.length) {
      return observations.map((obs) => ({
        id: obs.x + obs.y,
        x: obs.x,
        y: obs.y,
        status: obs.status,
      }));
    }
    return [];
  }, [observations]);

  useAnimatedReaction(
    () => scale.value,
    (newScale) => {
      runOnJS(setCurrentScale)(newScale);
    }
  );

  const zoomInToMax = async ({ x, y }: { x: number; y: number }) => {
    const left = x * imageSize.width - 10;
    const top = y * imageSize.height - 10;
    if (zoomableRef.current) {
      zoomableRef.current.zoom({ x: left, y: top, scale: 5 });
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <>
          <Text style={styles.label}>
            {label}
            <Text style={styles.labelRequired}>{'*'}</Text>
          </Text>
          <Text style={styles.labelHint}>{t('pinpointLocation')}</Text>
        </>
      )}
      <TouchableOpacity activeOpacity={1}>
        <Zoomable
           
          //@ts-ignore
          ref={zoomableRef}
          scale={scale}
          maxScale={5}
          doubleTapScale={5}
          onSingleTap={handlePress}
          isSingleTapEnabled
          isDoubleTapEnabled
        >
          <ImageBox url={imageMap} showError onImageLayout={onImageLayout} />
          <RenderedPins
            pin={pin}
            pinType={pinType}
            pinData={showPins()}
            currentScale={currentScale}
            imageSize={imageSize}
            editable={editable}
            handleOnePressPin={zoomInToMax}
          />
        </Zoomable>
      </TouchableOpacity>
      {/* <HintLine scale={currentScale} /> */}
    </View>
  );
});
export default PinOnMap;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  labelRequired: {
    color: '#EF6F08',
  },
  labelHint: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 20,
  },
});
