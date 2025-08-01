import { useApiObservations } from '@/axios/api/observations';
import { ICreateObservation } from '@/components/createNewObservation';
import { useObservations } from '@/context/observationProvider';
import { useProjects } from '@/context/projectsProvider';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

interface IUseUploadObservation {
  callback?: () => void;
}

export default function useUploadObservation({ callback }: IUseUploadObservation) {
  const { singleProjects } = useProjects();
  const { observationResult } = useObservations();
  const { createObservation, getAllObservations, isLoading } = useApiObservations();
  const { t } = useTranslation();

  const createTwoButtonAlert = (text: string) => {
    Alert.alert('Project', text, [{ text: 'OK', onPress: () => {} }]);
  };

  const uploadObservation = async ({
    imageUrl,
    data,
  }: {
    imageUrl: string;
    data: ICreateObservation;
  }) => {
    const { name, photoList, locations, locationComment, category, deadline, assignees } =
      data;
    const checkX = Boolean(0 > Number(locations?.length && locations?.[0].x));

    if (!singleProjects?.id) {
      createTwoButtonAlert(t('pleaseSelectProject'));
    }
    if (singleProjects?.id && !locations?.length && !checkX) {
      createTwoButtonAlert(t('tapOnLocation'));
      return;
    }

    if (singleProjects && observationResult && locations?.length) {
      await createObservation({
        name,
        projectId: singleProjects?.id,
        photoList: [imageUrl || (photoList as string)],
        x: locations[0].x,
        y: locations[0].y,
        conversationId: observationResult?.id,
        locationComment,
        text: observationResult?.messages[1].content as string,
        category,
        deadline,
        assignees,
      })
        .then(async () => {
          router.navigate(
            singleProjects.id
              ? `/auth/projects/(id)/${singleProjects.id}`
              : '/auth/projects'
          );
          await getAllObservations({});
          callback?.();
        })
        .catch((error) => {
          console.log('createObservationError', error);
        });
    }
  };

  return { uploadObservation, isLoading };
}
