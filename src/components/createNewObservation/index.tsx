import React, { useEffect, useMemo, useState } from 'react';
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
import { IGetAllCategory, useApiObservations } from '@/axios/api/observations';
import { useObservations } from '@/context/observationProvider';
import { useApiUser } from '@/axios/api/users';
import { UserList } from '@/axios/api/auth';
import useGetUserInfo from '@/hooks/getUserInfo';
import { TimePickerModal, DatePickerModal } from 'react-native-paper-dates';
import MultiSelectDropdown from '../MultiSelectDropdown';

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
  categories?: string[];
  deadline?: Date;
  assignees?: string[];
  generalContractor?: string;
  subContractor?: string;
}

export default function CreateNewObservation({
  visible = false,
  hideModal,
  title,
  clearMessages,
  loadedObservationImage,
}: ICreateNewObservation) {
  const { t } = useTranslation();
  const { lang } = useGetUserInfo();

  const [category, setCategory] = useState<IGetAllCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  const [users, setUsers] = useState<UserList[]>([]);
  const [selectedUser, setSelectedUser] = useState<string[]>([]);

  const [date, setDate] = useState<Date>(new Date());
  const [visibleDatePicker, setVisibleDatePicker] = useState(false);
  const [visibleTimePicker, setVisibleTimePicker] = useState(false);

  const onDismiss = () => {
    setVisibleDatePicker(false);
    setVisibleTimePicker(false);
  };

  const { isAdmin } = useGetUserInfo();

  const { getProjects } = useGetAllProjects();
  const { singleProjects, projects, setSingleProject } = useProjects();
  const { getSingleProject } = useApiProject();
  const { uploads, isLoading: isLoadingUploads } = useApiUploads();
  const { getAllObservations } = useApiObservations();
  const { observation } = useObservations();
  const { getAllCategory } = useApiObservations();
  const { getUsersNameEmailList } = useApiUser();

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
    await getAllObservations({ projectId: id, page: 1, rowsPerPage: 1000 });
    await getUsersNameEmailList(id).then((res) => setUsers(res || []));
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
      if (resultUploads)
        await uploadObservation({
          imageUrl: resultUploads.url,
          data: { ...data, categories: selectedCategory },
        });
    } else {
      await uploadObservation({
        imageUrl: photoList as string,
        data: {
          ...data,
          categories: selectedCategory,
          deadline: date,
          assignees: selectedUser,
        },
      });
    }
  };

  useEffect(() => {
    getProjects({ status: 'Active', rowsPerPage: 1000 });
    getAllCategory().then((res) => setCategory(res || []));
  }, []);

  useEffect(() => {
    setSingleProject(null);
    return () => {
      setSelectedUser([]);
      setSelectedCategory([]);
      setDate(new Date());
    };
  }, [visible]);

  console.log(
    category.map((item) => ({
      label: item.name,
      value: item.name,
      id: item.name,
    }))
  );

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
          <MultiSelectDropdown
            required
            search
            data={category.map((item) => ({
              label: item.specification,
              id: item.name,
              name: item.name,
            }))}
            placeholderInput="chooseCategory"
            label={t('chooseCategory')}
            onChange={(selectedItems) => {
              setSelectedCategory(selectedItems as string[]);
            }}
          />

          <TextField<ICreateObservation>
            control={control}
            errors={errors}
            label={t('generalContractor')}
            name="generalContractor"
          />

          <TextField<ICreateObservation>
            control={control}
            errors={errors}
            label={t('subContractor')}
            name="subContractor"
          />

          {singleProjects && (
            <>
              <PinOnMap
                observations={observation.observations}
                label={t('chooseLocation')}
                imageMap={singleProjects?.mainPhoto}
                pinType="observation"
                setLocations={(e) => {
                  setValue('locations', e);
                }}
              />

              {isAdmin && (
                <>
                  <DropdownItem
                    data={users.map((user) => ({
                      label: user.name,
                      value: user.id,
                    }))}
                    placeholder={t('chooseAssignee')}
                    onChange={(e) => setSelectedUser([e.value])}
                    label={t('assignees')}
                  />
                  {selectedUser.length > 0 && (
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <TouchableOpacity
                        style={{ flex: 1, width: '100%' }}
                        onPress={() => {
                          setVisibleDatePicker(true);
                        }}
                      >
                        <Text style={styles.dateTimeText}>
                          <Text style={{ fontWeight: '700' }}>Date: </Text>
                          {date?.toLocaleDateString()}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{ flex: 1, width: '100%' }}
                        onPress={() => {
                          setVisibleTimePicker(true);
                        }}
                      >
                        <Text style={styles.dateTimeText}>
                          <Text style={{ fontWeight: '700' }}>Time: </Text>
                          {date?.toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </>
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

        <TimePickerModal
          visible={visibleTimePicker}
          onDismiss={onDismiss}
          onConfirm={({ minutes, hours }) => {
            setDate(new Date(date.setHours(hours, minutes)));
            onDismiss();
          }}
          use24HourClock
        />

        <DatePickerModal
          locale={lang ?? 'en'}
          mode="single"
          date={date}
          visible={visibleDatePicker}
          onDismiss={onDismiss}
          onConfirm={({ date }) => {
            setDate(date as Date);
            onDismiss();
          }}
        />
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
  dateTimeText: {
    borderColor: '#D0D5DD',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
});
