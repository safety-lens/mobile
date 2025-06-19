import { StatusTitle } from '@/types/observation';
import { TFunction } from 'i18next';

export const statusTitleText = (t: TFunction<'translation', undefined>) => ({
  addressed: t('addressed'),
  inProgress: t('inProgress'),
  notAddressed: t('notAddressed'),
});

export const statusTitle = {
  addressed: 'Addressed',
  inProgress: 'In progress',
  notAddressed: 'Not addressed',
};

export function getStatusTitle(value: StatusTitle) {
  return Object.entries(statusTitle).find(([_, val]) => val === value)?.[0];
}
