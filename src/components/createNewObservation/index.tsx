import React, { useEffect, useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import Modal from '@/modal';
import TextField from '@/components/form/textField';
import CustomButton from '@/components/CustomButton/button';
import IconClose from '../../../assets/svgs/iconClose';
import PinOnMap, { IPin } from '../pinOnMap';
import { useProjects } from '@/context/projectsProvider';
import { useApiUploads } from '@/axios/api/uploads';
import { formDataFunc } from '@/utils/formData';
import Skeleton from '../skeleton';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';
import DropdownItem from '../dropdown';
import { useApiProject } from '@/axios/api/projects';
import useUploadObservation from '@/hooks/useUploadObservation';
import useGetAllProjects from '@/hooks/useGetAllProjects';
import { useApiObservations } from '@/axios/api/observations';
import { useObservations } from '@/context/observationProvider';

interface ICreateNewObservation {
  visible: boolean;
  title?: string;
  hideModal: () => void;
  clearMessages?: () => void;
  loadedObservationImage?: string;
}

export interface ICreateObservation {
  name: string;
  locations: IPin[] | null;
  photoList: ImagePicker.ImagePickerSuccessResult | string;
  imageMap?: '';
  //TODO 342
  locationComment?: '';
}

export default function CreateNewObservation({
  visible = false,
  hideModal,
  title,
  clearMessages,
  loadedObservationImage,
}: ICreateNewObservation) {
  const { getProjects } = useGetAllProjects();
  const { singleProjects, projects, setSingleProject } = useProjects();
  const { getSingleProject } = useApiProject();
  const { uploads, isLoading: isLoadingUploads } = useApiUploads();
  const { t } = useTranslation();
  const { getAllObservations } = useApiObservations();
  const { observation } = useObservations();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ICreateObservation>({
    defaultValues: {
      name: '',
      locations: null,
      photoList: loadedObservationImage,
      locationComment: '',
    },
  });

  const renamedData = useMemo(() => {
    return projects.projects.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
  }, [projects.projects]);

  const updateSingleProject = async (id: string) => {
    await getSingleProject({ id });
    await getAllObservations({ projectId: id, page: 1 });
  };

  const close = () => {
    hideModal();
    reset();
  };

  const closeAndClear = () => {
    close();
    clearMessages?.();
  };

  const { uploadObservation, isLoading } = useUploadObservation({
    callback: closeAndClear,
  });

  const onSubmit = async (data: ICreateObservation) => {
    const { photoList } = data;

    const image = typeof photoList !== 'string' && photoList?.assets?.[0];

    if (image) {
      const formData = formDataFunc(image);
      const resultUploads = await uploads({ file: formData });
      if (resultUploads) await uploadObservation({ imageUrl: resultUploads.url, data });
    } else {
      await uploadObservation({ imageUrl: photoList as string, data });
    }
  };

  useEffect(() => {
    getProjects({ status: 'Active', rowsPerPage: 100 });
  }, []);

  useEffect(() => {
    setSingleProject(null);
  }, [visible]);

  return (
    <Modal visible={visible} hideModal={close}>
      <>
        <Skeleton isLoading={isLoading || isLoadingUploads} />
        <View style={styles.formHead}>
          <Text style={styles.formHeadText}>{title}</Text>
          <TouchableOpacity onPress={close}>
            <IconClose />
          </TouchableOpacity>
        </View>

        <View style={styles.formBox}>
          <TextField<ICreateObservation>
            control={control}
            errors={errors}
            label={t('name')}
            name="name"
            required
          />

          <DropdownItem
            search
            data={renamedData}
            onChange={(e) => updateSingleProject(e.value)}
            label={t('chooseProject')}
          />

          {singleProjects && (
            <PinOnMap
              observations={observation.observations}
              label={t('chooseLocation')}
              imageMap={singleProjects?.mainPhoto}
              pinType="observation"
              setLocations={(e) => {
                setValue('locations', e);
              }}
            />
          )}
          {/* TODO 342 */}
          {singleProjects && (
            <TextField<ICreateObservation>
              control={control}
              errors={errors}
              label={t('observationDetail')}
              name="locationComment"
            />
          )}

          <View>
            <Text style={styles.label}>{t('picturesOfObservation')}</Text>
            <Image source={{ uri: loadedObservationImage }} style={styles.image} />
          </View>
        </View>
        <View style={styles.buttonBox}>
          <CustomButton
            onPress={close}
            title={t('cancelButton')}
            backgroundColor="#fff"
            outline
          />
          <CustomButton
            styleAppBtn={{ flex: 1 }}
            title={t('postObservation')}
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
  image: {
    marginTop: 12,
    width: 250,
    height: 250,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    lineHeight: 20,
  },
});
