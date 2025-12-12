import { Observation } from '@/types/observation';

interface IGenerateObservationCSV {
  data: Observation[];
  projectLocation: string;
}

const escapeCSVValue = (value: string): string => {
  if (!value) return '';
  const stringValue = String(value);
  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const convertToCSV = (data: Record<string, string | number>[]): string => {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const headerRow = headers.map((header) => escapeCSVValue(header)).join(',');
  const dataRows = data.map((row) =>
    headers.map((header) => escapeCSVValue(String(row[header] || ''))).join(',')
  );
  return [headerRow, ...dataRows].join('\n');
};

export const generateObservationCSV = async ({
  data,
  projectLocation,
}: IGenerateObservationCSV): Promise<string> => {
  const observations = Array.isArray(data) ? data : [data];

  const csvData = observations
    .map((observation, index) => ({
      'Observation #': index + 1,
      'Observation Name': observation.name || '-',
      'Observation Picture': observation.photoList?.join('; ') || '-',
      Reporter: observation.reporter || '-',
      Date: observation.createdAt
        ? new Date(observation.createdAt).toLocaleDateString()
        : '-',
      Location: projectLocation || '-',
      'General Contractor': observation.contractor || '-',
      'Sub Contractor': observation.subContractor || '-',
      'Category of Observation':
        observation.categories && observation.categories.length > 0
          ? observation.categories.map((c) => c.name).join(', ')
          : observation.category || '-',
      'Status of Observation': observation.status || '-',
      Assignee: observation.assignees?.map((a) => a.name || a.email).join(', ') || '-',
      'Deadline to Complete': observation.deadline
        ? new Date(observation.deadline).toLocaleDateString()
        : '-',
      'Closed Date': observation.closeDate
        ? new Date(observation.closeDate).toLocaleDateString()
        : '-',
      'Follow Up': observation.implementedActions || observation.followUp || '-',
      'Notes/Comments': observation.note || '-',
    }))
    .map((row) => {
      return Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(', ') : value,
        ])
      );
    });

  const csvString = convertToCSV(csvData);

  return csvString;
};
