import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ScreenTopNav from '@/components/screenTopNav';
import ScreenLayout from '@/components/screenLayout';
import ProjectDropdown from '@/components/projectDropdown';
import DropdownItem from '@/components/dropdown';
import CustomButton from '@/components/CustomButton/button';
import TableReports from './tableReports';
import { Divider, Menu } from 'react-native-paper';
import ReportsFilter, { IReportsFilter } from './reportsFilter';
import { DatePickerModal } from 'react-native-paper-dates';
import useGetUserInfo from '@/hooks/getUserInfo';
import { dateFormat } from '@/utils/dateFormat';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { apiInstance } from '@/axios';
import Pagination from '@/components/pagination';
import { ObservationsResponse } from '@/types/observation';
import ShareProjectModal from './ShareProjectModal';
import DownloadModal, { TChecked } from './DownloadModal';
import ShareIcon from '../../../../assets/svgs/shareIcon';
import DownloadIcon from '../../../../assets/svgs/downloadIcon';
import { generateObservationPdf } from '@/utils/generateObservationPdf';
import { generateObservationXLS } from '@/utils/generateObservationXLS';
import { useApiUploads } from '@/axios/api/uploads';
import { useApiObservations } from '@/axios/api/observations';
import Toast from 'react-native-toast-message';
import { generateObservationCSV } from '@/utils/generateObservationCSV';

interface IRange {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

type TSelectRangeLabel =
  | 'selectDateRange'
  | 'last7days'
  | 'last30days'
  | 'last3months'
  | 'last6months'
  | 'last1year'
  | 'allTime';

export default function Reports() {
  const { t } = useTranslation();
  const { lang } = useGetUserInfo();

  const screenWidth = Dimensions.get('window').width;

  const [visible, setVisible] = React.useState(false);
  const [projectId, setProjectId] = React.useState('');
  const [projectName, setProjectName] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);

  const [isLoadingShare, setIsLoadingShare] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState<IRange>({
    startDate: undefined,
    endDate: undefined,
  });
  const [dateRange, setDateRange] = React.useState<IRange>({
    startDate: undefined,
    endDate: undefined,
  });

  const [selectRangeLabel, setSelectRangeLabel] =
    React.useState<TSelectRangeLabel>('allTime');

  const [shareProjectModalVisible, setShareProjectModalVisible] = React.useState(false);
  const [downloadModalVisible, setDownloadModalVisible] = React.useState(false);

  const [filters, setFilters] = React.useState<IReportsFilter>({
    location: '',
    generalContractor: '',
    category: '',
    status: '',
    assigneeId: '',
  });

  const { uploads } = useApiUploads();
  const { reportShare } = useApiObservations();

  const calculateLastDays = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return {
      startDate,
      endDate,
    };
  };

  const dataRangeCopy: Record<
    TSelectRangeLabel,
    { label: string; value: TSelectRangeLabel; range: IRange }
  > = {
    allTime: {
      label: t('allTime'),
      value: 'allTime',
      range: { startDate: undefined, endDate: undefined },
    },
    last7days: { label: 'Last 7 Days', value: 'last7days', range: calculateLastDays(7) },
    last30days: {
      label: t('last30days'),
      value: 'last30days',
      range: calculateLastDays(30),
    },
    last3months: {
      label: t('last3months'),
      value: 'last3months',
      range: calculateLastDays(90),
    },
    last6months: {
      label: t('last6months'),
      value: 'last6months',
      range: calculateLastDays(180),
    },
    last1year: {
      label: t('last1year'),
      value: 'last1year',
      range: calculateLastDays(365),
    },
    selectDateRange: {
      label:
        range.startDate && range.endDate && selectRangeLabel === 'selectDateRange'
          ? `${dateFormat(range.startDate)} - ${dateFormat(range.endDate)}`
          : t('selectDateRange'),
      value: 'selectDateRange',
      range: { startDate: dateRange.startDate, endDate: dateRange.endDate },
    },
  };

  const dataRange = Object.values(dataRangeCopy);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const onDismiss = () => {
    setOpen(false);
  };

  const handleSelectRange = (value: TSelectRangeLabel) => {
    setSelectRangeLabel(value);
    setRange(dataRangeCopy[value as keyof typeof dataRangeCopy]?.range);
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onConfirm = ({ startDate, endDate }: any) => {
    setDateRange({
      startDate: startDate,
      endDate: endDate,
    });
    setSelectRangeLabel('selectDateRange');
    setOpen(false);
  };

  const getParams = () => {
    return {
      page: currentPage,
      pageSize: 10,
      projectId,
      startPeriod: range.startDate,
      finishPeriod: range.endDate,
      ...filters,
    };
  };

  const { data: reports, isLoading } = useQuery({
    queryKey: ['observations', currentPage, projectId, range, filters],
    queryFn: async () => {
      const response: AxiosResponse<ObservationsResponse> = await apiInstance.get(
        `/observations`,
        {
          params: getParams(),
        }
      );
      return response.data;
    },
  });

  const createPdf = async () => {
    const range = dataRangeCopy[selectRangeLabel as keyof typeof dataRangeCopy]?.label;
    await generateObservationPdf({
      projectName,
      data: reports?.observations || [],
      range: range,
    });
  };

  const createXLS = async () => {
    await generateObservationXLS({
      projectName,
      data: reports?.observations || [],
    });
  };

  const createCSV = async () => {
    await generateObservationCSV({
      projectName,
      data: reports?.observations || [],
    });
  };

  const shareFile = async (email: string, message: string, format: TChecked) => {
    setIsLoadingShare(true);

    let uriString: string = '';
    if (format === 'PDF') {
      const { uri: pdfUri } = await generateObservationPdf({
        projectName,
        data: reports?.observations || [],
        showShare: true,
        range: dataRangeCopy[selectRangeLabel as keyof typeof dataRangeCopy]?.label,
      });
      if (!pdfUri) return;
      uriString = pdfUri;
    } else if (format === 'XLS') {
      const { uri: xlsUri } = await generateObservationXLS({
        projectName,
        data: reports?.observations || [],
        showShare: true,
      });
      uriString = xlsUri;
    } else if (format === 'CSV') {
      const { uri: csvUri } = await generateObservationCSV({
        projectName,
        data: reports?.observations || [],
        showShare: true,
      });
      uriString = csvUri;
    }

    if (!uriString) return;
    const formData = new FormData();

    formData.append('file', {
      uri: uriString,
      name: `report.${format === 'XLS' ? 'xlsx' : format === 'PDF' ? 'pdf' : 'csv'}`,
      type:
        format === 'XLS'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : format === 'PDF'
            ? 'application/pdf'
            : 'text/csv',
    } as unknown as File);

    const resultUploads = await uploads({ file: formData });
    if (resultUploads) {
      reportShare({
        comment: message,
        email,
        format,
        s3Uri: resultUploads.url,
      })
        .then((e) => {
          if (e) {
            Toast.show({
              type: 'success',
              text1: t('success'),
              text2: 'Report shared successfully!',
            });
            setShareProjectModalVisible(false);
          }
        })
        .finally(() => setIsLoadingShare(false));
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.topNavContainer}>
        <ScreenTopNav title={t('Reports')} backPath="/auth/myProfile" />
      </View>
      <ScrollView style={styles.bottomBlock}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <CustomButton
            title={t('download')}
            styleAppBtn={{ height: 50, width: 140 }}
            backgroundColor="#010101"
            onPress={() => {
              if (projectId) {
                setDownloadModalVisible(true);
              } else {
                Toast.show({
                  type: 'info',
                  text1: t('selectProject'),
                });
              }
            }}
            icon={<DownloadIcon />}
          />
          <CustomButton
            title={t('shareTitle')}
            styleAppBtn={{ height: 50, width: 140 }}
            backgroundColor="#010101"
            onPress={() => {
              if (projectId) {
                setShareProjectModalVisible(true);
              } else {
                Toast.show({
                  type: 'info',
                  text1: t('selectProject'),
                });
              }
            }}
            icon={<ShareIcon />}
          />
        </View>

        <View style={{ marginTop: 24 }}>
          <ProjectDropdown
            onChange={(id, name) => {
              setProjectId(id);
              setProjectName(name || '');
            }}
            label={t('project')}
          />
        </View>

        <View style={{ marginTop: 24 }}>
          <DropdownItem
            search
            data={dataRange}
            defaultValue={dataRangeCopy.allTime.value}
            onChange={(e) => {
              if (e?.value === 'selectDateRange') {
                setOpen(true);
              } else {
                handleSelectRange(e?.value as TSelectRangeLabel);
                setSelectRangeLabel(e?.value as TSelectRangeLabel);
              }
            }}
            label={t('dateRange')}
          />
        </View>

        <View style={styles.userActivityContainer}>
          <Text style={styles.userActivityText}>
            User Activity (
            {dataRangeCopy[selectRangeLabel as keyof typeof dataRangeCopy]?.label})
          </Text>
          <Menu
            contentStyle={[styles.menuContent, { width: screenWidth - 30 }]}
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <CustomButton
                title={t('filters')}
                styleAppBtn={{
                  width: 100,
                  borderWidth: 1,
                  borderColor: 'grey',
                }}
                styleBtn={{ color: 'black' }}
                backgroundColor="white"
                onPress={openMenu}
              />
            }
          >
            <ScrollView style={{ flex: 1 }}>
              <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#E9EAEB' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{t('filters')}</Text>
              </View>
              <View style={{ padding: 10 }}>
                <ReportsFilter
                  projectId={projectId}
                  onClose={closeMenu}
                  onApply={setFilters}
                  filters={getParams()}
                />
              </View>
              <Divider />
            </ScrollView>
          </Menu>
        </View>

        <TableReports
          reports={reports?.observations || []}
          isLoading={isLoading}
          projectId={projectId}
        />

        <Pagination
          currentPage={currentPage}
          count={reports?.count || 0}
          pageSize={10}
          onPageChange={(page) => {
            setCurrentPage(page);
          }}
        />
      </ScrollView>

      <DatePickerModal
        locale={lang ?? 'en'}
        mode="range"
        visible={open}
        onDismiss={onDismiss}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onConfirm={onConfirm}
      />

      <ShareProjectModal
        projectName={projectName}
        visible={shareProjectModalVisible}
        hideModal={() => setShareProjectModalVisible(false)}
        handleSharePdf={(email, message, format) => shareFile(email, message, format)}
        isLoadingReportShare={isLoadingShare}
      />

      <DownloadModal
        projectName={projectName}
        visible={downloadModalVisible}
        hideModal={() => setDownloadModalVisible(false)}
        createPdf={createPdf}
        createXLS={createXLS}
        createCSV={createCSV}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  bottomBlock: {
    flex: 1,
    paddingBottom: 75,
  },
  topNavContainer: {
    marginBottom: 10,
  },
  userActivityContainer: {
    gap: 8,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    marginTop: 25,
  },
  userActivityText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 50,
  },
});
