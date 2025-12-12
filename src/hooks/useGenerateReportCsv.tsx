import { Observation } from '@/types/observation';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useCallback } from 'react';
import { generateObservationCSV } from '@/utils/generateFiles/generateObservationCSV';
import { generateReportName } from '@/utils/files';

interface UseGenerateReportCsvProps {
  projectName: string;
  data: Observation[];
  range: string;
  projectLocation: string;
}

export const useGenerateReportCsv = ({
  projectName,
  data,
  range,
  projectLocation,
}: UseGenerateReportCsvProps) => {
  const fileName = generateReportName(projectName, 'csv', range);
  const newPath = FileSystem.documentDirectory + fileName;

  const generateCsv = useCallback(async () => {
    const csv = await generateObservationCSV({
      data,
      projectLocation,
    });
    return csv;
  }, [data, projectLocation]);

  const generateReportCsv = useCallback(async () => {
    const csv = await generateCsv();
    await FileSystem.writeAsStringAsync(newPath, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(newPath, {
        mimeType: 'text/csv',
        dialogTitle: 'Share Observations Report',
        UTI: 'public.comma-separated-values-text',
      });
    }
    return { uri: newPath };
  }, [newPath, generateCsv]);

  const shareReportCsv = useCallback(async () => {
    const csv = await generateCsv();
    await FileSystem.writeAsStringAsync(newPath, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    return { uri: newPath };
  }, [newPath, generateCsv]);

  return { generateReportCsv, shareReportCsv };
};
