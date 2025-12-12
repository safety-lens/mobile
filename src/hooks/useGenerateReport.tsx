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

export default function useGenerateReport(props: UseGenerateReportProps) {
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
