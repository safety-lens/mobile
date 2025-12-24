import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { DatePickerModal } from 'react-native-paper-dates';
import ArrowIcon from '../../../assets/svgs/arrowIcon';
import { Colors } from '@/constants/Colors';
import { convertDate } from '@/utils/dateFormat';

import { useTranslation } from 'react-i18next';
import useGetUserInfo from '@/hooks/getUserInfo';
import IconClose from '../../../assets/svgs/iconClose';

export interface RangeParams {
  startPeriod: undefined | Date;
  finishPeriod: undefined | Date;
}

interface FiltrateObservations {
  onRange: ({ startPeriod, finishPeriod }: RangeParams) => void;
}

export type DateRange = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};

export default function FiltrateObservations({ onRange }: FiltrateObservations) {
  const { t } = useTranslation();
  const [range, setRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });
  const [open, setOpen] = useState(false);
  const { lang, refreshUserInfo } = useGetUserInfo();

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = ({ startDate, endDate }: DateRange) => {
    const dateTo = new Date(endDate || '');
    const dateFrom = new Date(startDate || '');

    dateTo.setHours(23, 59, 59, 999);
    dateFrom.setHours(0, 0, 0, 0);

    setOpen(false);
    setRange({ startDate: dateFrom, endDate: dateTo });
    if (!dateFrom) {
      onRange({ startPeriod: undefined, finishPeriod: undefined });
    } else {
      onRange({ startPeriod: dateFrom, finishPeriod: dateTo });
    }
  };

  const clearData = () => {
    onConfirm({
      startDate: undefined,
      endDate: undefined,
    });
  };

  useEffect(() => {
    refreshUserInfo();
  }, [open]);

  return (
    <View>
      <TouchableOpacity onPress={() => setOpen(true)} style={[styles.cardBox]}>
        <View style={styles.statusBox}>
          <Text style={styles.dateString}>
            {range.startDate
              ? `${convertDate(range.startDate)} - ${convertDate(range.endDate)}`
              : t('dateFilter')}
          </Text>
          <View style={styles.arrowIcon}>
            <ArrowIcon />
          </View>
        </View>
        {range.startDate && (
          <TouchableOpacity
            onPress={clearData}
            style={{
              position: 'absolute',
              right: 35,
              opacity: 0.8,
              padding: 5,
            }}
          >
            <IconClose />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      <DatePickerModal
        locale={lang ?? 'en'}
        mode="range"
        visible={open}
        onDismiss={onDismiss}
        startDate={range.startDate}
        endDate={range.endDate}
        onConfirm={onConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardBox: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,

    borderColor: '#EBEBEB',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  statusBox: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowIcon: {
    transform: 'rotate(-90deg)',
  },
  dateString: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 17,
    color: Colors.light.text,
  },
});
