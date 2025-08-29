export const dateFormat = (date: Date) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString('en-US');
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
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const day = newDate.getDate();
  const month = months[newDate.getMonth()];
  const year = newDate.getFullYear();
  const time = newDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${day} ${month} ${year}, ${time}`;
};
