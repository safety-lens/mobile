import { StatusTitle } from '@/types/observation';

interface IObjectWithStatus {
  status?: StatusTitle | 'mix';
}
export function determineOverallStatus(
  objects: IObjectWithStatus[]
): StatusTitle | 'mix' | undefined {
  const allStatuses = objects.reduce<StatusTitle[]>((acc, obj) => {
    return obj?.status && obj.status !== 'mix' ? acc.concat(obj.status) : acc;
  }, []);
  if (allStatuses.length === 0) {
    return undefined;
  }
  const isAllInProgress = allStatuses.every((status) => status === 'In progress');
  const isAllNotAddressed = allStatuses.every((status) => status === 'Not addressed');
  const isAllAddressed = allStatuses.every((status) => status === 'Addressed');
  if (isAllInProgress) {
    return 'In progress';
  } else if (isAllNotAddressed) {
    return 'Not addressed';
  } else if (isAllAddressed) {
    return 'Addressed';
  } else {
    return 'mix';
  }
}
