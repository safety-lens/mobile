import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import Modal from '@/modal';
import TextField from '@/components/form/textField';
import CustomButton from '@/components/CustomButton/button';
import UploadPhoto from '@/components/form/uploadPhoto';
import PinOnMap, { IPin } from '@/components/pinOnMap';
import IconClose from '../../../../assets/svgs/iconClose';
import { useProjects } from '@/context/projectsProvider';
import { useApiProject } from '@/axios/api/projects';
import { useAuth } from '@/context/AuthProvider';
import { formDataFunc } from '@/utils/formData';
import { useApiUploads } from '@/axios/api/uploads';
import Skeleton from '@/components/skeleton';
import { useTranslation } from 'react-i18next';
import { useObservations } from '@/context/observationProvider';
import Toast from 'react-native-toast-message';

interface IEditProjectModal {
  visible: boolean;
  title?: string;
  hideModal: () => void;
  imageMap?: string;
}

export interface IEditProjectModalForm {
  name: string;
  projectNumber: string;
  locations: IPin[];
  mainPhoto: ImagePicker.ImagePickerSuccessResult | string;
}

interface UpdateProjectFlow {
  imageUrl?: string;
  data: IEditProjectModalForm;
}

export default function EditProjectModal({
  visible = false,
  hideModal,
  title,
  // imageMap,
}: IEditProjectModal) {
  const { singleProjects } = useProjects();
  const { observation } = useObservations();
  const { updateProject, getSingleProject, getAllProject, isLoading } = useApiProject();
  const { uploads, isLoading: isLoadingUpload } = useApiUploads();
  const { user } = useAuth();
  const { t } = useTranslation();
  const isUserId = user?.auth.role !== 'user' ? user?.auth.id : undefined;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IEditProjectModalForm>({
    defaultValues: {
      name: '',
      projectNumber: '',
      locations: [{ x: 0, y: 0, id: 0 }],
      mainPhoto: undefined,
    },
  });

  const updateProjectFlow = async ({ imageUrl, data }: UpdateProjectFlow) => {
    const { name, projectNumber } = data;
    if (singleProjects) {
      updateProject({
        projectId: singleProjects.id,
        data: { name, mainPhoto: imageUrl, projectNumber },
      })
        .then(async (res) => {
          if (res && res) {
            Toast.show({
              type: 'success',
              text1: t('success'),
              text2: t('projectUpdate'),
            });
            await getSingleProject({
              id: res.id,
            });
          }
          await getAllProject({ userId: isUserId });
        })
        .finally(() => hideModal());
      reset();
    }
  };

  const onSubmit = async (data: IEditProjectModalForm) => {
    const { mainPhoto } = data;
    const image = typeof mainPhoto !== 'string' && mainPhoto?.assets?.[0];
    if (image) {
      const formData = formDataFunc(image);
      await uploads({ file: formData })
        .then((e) => {
          if (e && e.url) {
            updateProjectFlow({ imageUrl: e.url, data });
          }
        })
        .catch((error) => console.log('uploads error', error));
    } else {
      updateProjectFlow({ data });
    }
  };

  // const watchImage = watch('mainPhoto');

  useEffect(() => {
    if (singleProjects) {
      setValue('name', singleProjects.name);
      setValue('projectNumber', singleProjects.projectNumber);
      setValue('mainPhoto', singleProjects.mainPhoto);
    }
  }, [singleProjects]);

  return (
    <Modal visible={visible} hideModal={hideModal}>
      <>
        <Skeleton isLoading={isLoadingUpload || isLoading} />
        <View style={styles.formHead}>
          <Text style={styles.formHeadText}>{title}</Text>
          <TouchableOpacity onPress={hideModal}>
            <IconClose />
          </TouchableOpacity>
        </View>

        <View style={styles.formBox}>
          <TextField<IEditProjectModalForm>
            control={control}
            errors={errors}
            label={t('name')}
            name="name"
            required
            placeholder="New project"
          />

          <TextField<IEditProjectModalForm>
            control={control}
            errors={errors}
            label={t('projectNumber')}
            name="projectNumber"
            // required
            placeholder={t('projectNumber')}
            pattern={{
              value: /^[^()\s]+$/,
              message: 'Spaces and parentheses () are not allowed',
            }}
          />

          <PinOnMap
            observations={observation.observations}
            imageMap={singleProjects?.mainPhoto}
            setLocations={(e) => setValue('locations', e)}
          />

          <UploadPhoto<IEditProjectModalForm>
            control={control}
            errors={errors}
            label={t('mainPhoto')}
            name="mainPhoto"
            required
          />
        </View>
        <View style={styles.buttonBox}>
          <CustomButton
            onPress={hideModal}
            title={t('cancelButton')}
            backgroundColor="#fff"
            outline
          />
          <CustomButton
            styleAppBtn={{ flex: 1 }}
            title={t('save')}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </>
    </Modal>
  );
}

const styles = StyleSheet.create({
  formHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formHeadText: {
    color: '#0A2540',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  formBox: {
    marginTop: 40,
    gap: 24,
  },
  buttonBox: {
    marginVertical: 24,
    flexDirection: 'row',
    gap: 8,
  },
});
