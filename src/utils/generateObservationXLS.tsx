import { Observation } from '@/types/observation';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface IGenerateObservationXLS {
  projectName: string;
  data: Observation[];
  showShare?: boolean;
}

export const generateObservationXLS = async ({
  projectName,
  data,
  showShare = false,
}: IGenerateObservationXLS): Promise<{ uri: string }> => {
  const observations = Array.isArray(data) ? data : [data];

  const worksheetData = observations.map((observation, index) => ({
    'Observation #': index + 1,
    'Observation Name': observation.name || '-',
    'Observation Picture': observation.photoList?.join('; ') || '-',
    Reporter: observation.reporter || '-',
    Date: observation.createdAt
      ? new Date(observation.createdAt).toLocaleDateString()
      : '-',
    Location: observation.note || observation.location || '-',
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
    'Closed Date': observation.closedDate
      ? new Date(observation.closedDate).toLocaleDateString()
      : '-',
    'Follow Up': observation.implementedActions || observation.followUp || '-',
    'Notes/Comments': observation.note || '-',
  }));

  console.log(worksheetData);

  const ws = XLSX.utils.json_to_sheet(worksheetData);
  const wb = XLSX.utils.book_new();
  const columnWidths = [
    { wch: 15 }, // Observation #
    { wch: 20 }, // Observation Name
    { wch: 50 }, // Observation Picture
    { wch: 20 }, // Reporter
    { wch: 15 }, // Date
    { wch: 25 }, // Location
    { wch: 20 }, // General Contractor
    { wch: 20 }, // Sub Contractor
    { wch: 25 }, // Category of Observation
    { wch: 20 }, // Status of Observation
    { wch: 25 }, // Assignee
    { wch: 20 }, // Deadline to Complete
    { wch: 15 }, // Closed Date
    { wch: 20 }, // Follow Up
    { wch: 30 }, // Notes/Comments
  ];

  ws['!cols'] = columnWidths;

  XLSX.utils.book_append_sheet(wb, ws, 'Observation');

  const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

  const fileName = `${projectName.replace(/[^a-z0-9]/gi, '_')}_observations_${new Date().toISOString().split('T')[0]}.xlsx`;
  const uri = FileSystem.documentDirectory + fileName;

  await FileSystem.writeAsStringAsync(uri, wbout, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (!showShare && (await Sharing.isAvailableAsync())) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Share Observations Report',
      UTI: 'com.microsoft.excel.xlsx',
    });
  }

  return {
    uri,
  };
};
