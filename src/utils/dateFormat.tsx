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
