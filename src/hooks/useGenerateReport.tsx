import { Observation } from '@/types/observation';
import { useGenerateReportCsv } from './useGenerateReportCsv';
import { useGenerateReportPdf } from './useGenerateReportPdf';
import { useGenerateReportXls } from './useGenerateReportXls';

interface UseGenerateReportProps {
  projectName: string;
  data: Observation[];
  range: string;
  projectLocation: string;
}

interface GenerateReportResult {
  uri: string;
}
export type GenerateReportFunction = () => Promise<GenerateReportResult>;

type UseGenerateReportReturn = {
  generateReportCsv: GenerateReportFunction;
  shareReportCsv: GenerateReportFunction;
  generateReportPdf: GenerateReportFunction;
  shareReportPdf: GenerateReportFunction;
  generateReportXls: GenerateReportFunction;
  shareReportXls: GenerateReportFunction;
};

export default function useGenerateReport(
  props: UseGenerateReportProps
): UseGenerateReportReturn {
  const { generateReportCsv, shareReportCsv } = useGenerateReportCsv(props);
  const { generateReportPdf, shareReportPdf } = useGenerateReportPdf(props);
  const { generateReportXls, shareReportXls } = useGenerateReportXls(props);
  return {
    generateReportCsv,
    shareReportCsv,
    generateReportPdf,
    shareReportPdf,
    generateReportXls,
    shareReportXls,
  };
}
