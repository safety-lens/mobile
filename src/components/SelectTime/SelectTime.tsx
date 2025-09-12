import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Platform, StyleSheet } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { DatePickerModal } from 'react-native-paper-dates';
import useGetUserInfo from '@/hooks/getUserInfo';

export default function SelectTime({
  handleDateChange,
  defaultValue,
}: {
  handleDateChange: (date: Date) => void;
  defaultValue?: Date;
}) {
  const { t } = useTranslation();
  const { lang } = useGetUserInfo();

  const isAndroid = Platform.OS === 'android';

  const [date, setDate] = useState<Date>(new Date(defaultValue || new Date()));
  const [visibleTimePicker, setVisibleTimePicker] = useState(false);
  const [visibleDatePicker, setVisibleDatePicker] = useState(false);

  const onDismiss = () => {
    setVisibleDatePicker(false);
    setVisibleTimePicker(false);
  };

  return (
    <>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          style={{ flex: 1, width: '100%' }}
          onPress={() => {
            setVisibleDatePicker(true);
          }}
        >
          <View style={styles.dateTimeText}>
            <Text style={{ fontWeight: '700' }}>{t('date')}: </Text>
            <Text>{date?.toLocaleDateString()}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flex: 1, width: '100%' }}
          onPress={() => {
            setVisibleTimePicker(true);
          }}
        >
          <View style={styles.dateTimeText}>
            <Text
              style={{
                fontWeight: '700',
              }}
            >
              {t('time')}:{' '}
            </Text>
            {isAndroid && (
              <Text>
                {date?.toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </Text>
            )}
            {!isAndroid && (
              <RNDateTimePicker
                testID="dateTimePicker"
                mode="time"
                value={date}
                is24Hour={true}
                initialInputMode="default"
                fullscreen={true}
                display={'default'}
                title="Time"
                design="material"
                onChange={(_, date) => {
                  setDate(date as Date);
                  handleDateChange(date as Date);
                  onDismiss();
                }}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View>
        {visibleTimePicker && isAndroid && (
          <RNDateTimePicker
            mode="time"
            value={date}
            is24Hour={true}
            initialInputMode="default"
            fullscreen={true}
            display="spinner"
            onChange={(_, date) => {
              setDate(date as Date);
              handleDateChange(date as Date);
              onDismiss();
            }}
          />
        )}
      </View>
      <DatePickerModal
        locale={lang ?? 'en'}
        mode="single"
        date={date}
        visible={visibleDatePicker}
        onDismiss={onDismiss}
        onConfirm={({ date }) => {
          setDate(date as Date);
          onDismiss();
        }}
      />
    </>
  );
}
const styles = StyleSheet.create({
  dateTimeText: {
    height: 45,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#D0D5DD',

    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
});
