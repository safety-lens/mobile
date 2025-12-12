import { Observation } from '@/types/observation';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useCallback } from 'react';
import { generateObservationXLS } from '@/utils/generateFiles/generateObservationXLS';
import { generateReportName } from '@/utils/files';

interface UseGenerateReportXlsProps {
  projectName: string;
  data: Observation[];
  range: string;
  projectLocation: string;
}

export const useGenerateReportXls = ({
  projectName,
  data,
  range,
  projectLocation,
}: UseGenerateReportXlsProps) => {
  const fileName = generateReportName(projectName, 'xlsx', range);
  const newPath = FileSystem.documentDirectory + fileName;

  const generateXls = useCallback(async () => {
    const xls = await generateObservationXLS({
      data,
      projectLocation,
    });
    return xls;
  }, [data, projectLocation]);

  const generateReportXls = useCallback(async () => {
    const xls = await generateXls();
    await FileSystem.writeAsStringAsync(newPath, xls, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(newPath, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Share Observations Report',
        UTI: 'com.microsoft.excel.xlsx',
      });
    }
    return { uri: newPath };
  }, [newPath, generateXls]);

  const shareReportXls = useCallback(async () => {
    const xls = await generateXls();
    await FileSystem.writeAsStringAsync(newPath, xls, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return { uri: newPath };
  }, [newPath, generateXls]);

  return { generateReportXls, shareReportXls };
};
