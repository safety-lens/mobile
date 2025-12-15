import { Observation } from '@/types/observation';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useCallback } from 'react';
import { generateObservationHtml } from '@/utils/generateFiles/generateObservationHtml';
import { generateReportName } from '@/utils/files';

interface UseGenerateObservationPdfProps {
  projectName: string;
  data: Observation[];
  range: string;
  projectLocation: string;
}

export const useGenerateReportPdf = ({
  projectName,
  data,
  range,
  projectLocation,
}: UseGenerateObservationPdfProps) => {
  const fileName = generateReportName(projectName, 'pdf', range);
  const newPath = FileSystem.documentDirectory + fileName;

  const generateHtml = useCallback(async () => {
    const html = await generateObservationHtml({
      projectName,
      data,
      projectLocation,
    });
    return html;
  }, [data, projectLocation, projectName]);

  const printFile = useCallback(async () => {
    const { html, fileHeight, fileWidth } = await generateHtml();
    const { uri } = await Print.printToFileAsync({
      html,
      width: fileWidth,
      height: fileHeight,
      margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    });

    return uri;
  }, [generateHtml]);

  const generateReportPdf = useCallback(async () => {
    const uri = await printFile();
    await FileSystem.copyAsync({
      from: uri,
      to: newPath,
    });

    if (await Sharing.isAvailableAsync()) {
      Sharing.shareAsync(newPath);
    }
    return { uri: newPath };
  }, [newPath, printFile]);

  const shareReportPdf = useCallback(async () => {
    const uri = await printFile();
    await FileSystem.moveAsync({
      from: uri,
      to: newPath,
    });
    return { uri: newPath };
  }, [newPath, printFile]);

  return { generateReportPdf, shareReportPdf };
};
