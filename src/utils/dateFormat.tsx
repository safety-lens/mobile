import { t } from 'i18next';

export const dateFormat = (date: Date) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString('en-US');
};

export const dateFormatFull = (date: Date) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
};

export const convertDate = (date: Date | undefined): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US');
};

export const dateTimeFormat = (date: Date) => {
  const newDate = new Date(date);
  return newDate.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const fullDateTimeFormat = (date: Date) => {
  const newDate = new Date(date);

  const monthsLang = {
    1: t('months.January'),
    2: t('months.February'),
    3: t('months.March'),
    4: t('months.April'),
    5: t('months.May'),
    6: t('months.June'),
    7: t('months.July'),
    8: t('months.August'),
    9: t('months.September'),
    10: t('months.October'),
    11: t('months.November'),
    12: t('months.December'),
  };

  const day = newDate.getDate();
  const month = monthsLang[newDate.getMonth() as keyof typeof monthsLang];
  const year = newDate.getFullYear();
  const time = newDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${day} ${month} ${year}, ${time}`;
};
