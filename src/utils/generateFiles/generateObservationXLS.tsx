import { Observation } from '@/types/observation';
import * as XLSX from 'xlsx';

interface IGenerateObservationXLS {
  data: Observation[];
  projectLocation: string;
}

const COLUMN_SIZES = {
  xs: 15,
  sm: 20,
  md: 25,
  lg: 30,
  xl: 50,
};

export const generateObservationXLS = async ({
  data,
  projectLocation,
}: IGenerateObservationXLS): Promise<string> => {
  const observations = Array.isArray(data) ? data : [data];

  const worksheetData = observations.map((observation, index) => ({
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
  }));

  const ws = XLSX.utils.json_to_sheet(worksheetData);
  const wb = XLSX.utils.book_new();
  const columnWidths = [
    { wch: COLUMN_SIZES.xs }, // Observation #
    { wch: COLUMN_SIZES.sm }, // Observation Name
    { wch: COLUMN_SIZES.xl }, // Observation Picture
    { wch: COLUMN_SIZES.sm }, // Reporter
    { wch: COLUMN_SIZES.xs }, // Date
    { wch: COLUMN_SIZES.md }, // Location
    { wch: COLUMN_SIZES.sm }, // General Contractor
    { wch: COLUMN_SIZES.sm }, // Sub Contractor
    { wch: COLUMN_SIZES.md }, // Category of Observation
    { wch: COLUMN_SIZES.sm }, // Status of Observation
    { wch: COLUMN_SIZES.md }, // Assignee
    { wch: COLUMN_SIZES.sm }, // Deadline to Complete
    { wch: COLUMN_SIZES.xs }, // Closed Date
    { wch: COLUMN_SIZES.sm }, // Follow Up
    { wch: COLUMN_SIZES.lg }, // Notes/Comments
  ];

  ws['!cols'] = columnWidths;

  XLSX.utils.book_append_sheet(wb, ws, 'Observation');

  const result = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

  return result;
};
