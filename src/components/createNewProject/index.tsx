import React, { useEffect, useMemo, useState } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import Modal from '@/modal';
import TextField from '@/components/form/textField';
import CustomButton from '@/components/CustomButton/button';
import UploadPhoto from '@/components/form/uploadPhoto';
import IconClose from '../../../assets/svgs/iconClose';
import PlusCircle from '../../../assets/svgs/plusCircle';
import { Colors } from '@/constants/Colors';
import { useApiProject } from '@/axios/api/projects';
import { useAuth } from '@/context/AuthProvider';
import { useApiUploads } from '@/axios/api/uploads';
import { formDataFunc } from '@/utils/formData';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Skeleton from '../skeleton';
import DropdownItem from '../dropdown';
import { usStates } from '@/utils/usState';
import { useTranslation } from 'react-i18next';
import useGetUserInfo from '@/hooks/getUserInfo';
import { useApiUser } from '@/axios/api/users';
import MultiSelectDropdown from '../MultiSelectDropdown';
import { UserList } from '@/axios/api/auth';
import { useSubscription } from '@/context/SubscriptionProvider';

export interface ICreateProject {
  name: string;
  country: string;
  city: string;
  address: string;
  zipCode: string;
  mainPhoto?: ImagePicker.ImagePickerSuccessResult | string;
  projectNumber?: string;
  user?: string;
  state?: string;
  accountId?: string;
  usersIds?: string[];
}

export default function CreateNewProject() {
  const { user } = useAuth();
  const { isAdmin, isAdminAdmin } = useGetUserInfo();
  const { hasSubscriptionFeature } = useSubscription();
  const { createProject, getAllProject, getAllCompanies, isLoading } = useApiProject();
  const { getUsersNameEmailList } = useApiUser();
  const { uploads, isLoading: isLoadingUpload } = useApiUploads();
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState<UserList[]>([]);

  const [companies, setCompanies] = useState<
    { value: string; label: string }[] | undefined
  >([]);
  const { t } = useTranslation();

  const showModal = () => {
    setVisible(!visible);
    reset();
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ICreateProject>({
    defaultValues: {
      name: '',
      country: 'United States',
      city: '',
      address: '',
      zipCode: '',
      mainPhoto: undefined,
      projectNumber: '',
      state: '',
      accountId: '',
      usersIds: [],
    },
  });

  const onSubmit = async (data: ICreateProject) => {
    const image = typeof data?.mainPhoto !== 'string' && data?.mainPhoto?.assets?.[0];
    if (user && image) {
      const file = formDataFunc(image);

      const resultUploads = await uploads({ file });
      await createProject({ ...data, mainPhoto: resultUploads?.url, user: user.auth.id });
      showModal();
      await getAllProject({ userId: user.auth.id, status: 'Active' });
    }
  };

  function containsUSVariants() {
    const state = watch('country');
    if (typeof state !== 'string') return false;
    const patterns = ['USA', 'US', 'United Sta'];
    const formattedInput = state.trim().toLowerCase();
    if (formattedInput) {
      setValue('state', '');
    }
    return patterns.some((pattern) => formattedInput.includes(pattern.toLowerCase()));
  }

  const isState = containsUSVariants();

  const getCompanies = async () => {
    const allCompanies = await getAllCompanies();
    const renamedData = allCompanies?.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
    setCompanies(renamedData);
  };

  const getUsers = async () => {
    const allUsers = await getUsersNameEmailList();
    setUsers(allUsers);
  };

  useEffect(() => {
    if (isAdmin) getUsers();
    if (visible) getCompanies();
  }, [visible]);

  const usersDropdownData = useMemo(() => {
    return users.map((item) => ({
      label: item.name,
      labelSelected: `${item.name} – ${item.email}`,
      value: item.id,
    }));
  }, [users]);

  return (
    <>
      {user?.auth?.accountRole === 'admin' && (
        <CustomButton icon={<PlusCircle />} title={t('new')} onPress={showModal} />
      )}
      <Modal visible={visible} hideModal={showModal}>
        <KeyboardAwareScrollView style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView>
              <Skeleton isLoading={isLoadingUpload || isLoading} />

              <View style={styles.formHead}>
                <Text style={styles.formHeadText}>{t('createProject')}</Text>
                <TouchableOpacity onPress={showModal}>
                  <IconClose />
                </TouchableOpacity>
              </View>

              <View style={styles.formBox}>
                <TextField<ICreateProject>
                  control={control}
                  errors={errors}
                  label={t('projectName')}
                  name="name"
                  required
                />
                <TextField<ICreateProject>
                  control={control}
                  errors={errors}
                  label={t('projectNumber')}
                  name="projectNumber"
                  // required
                  pattern={{
                    value: /^[^()\s]+$/,
                    message: t('patternError'),
                  }}
                />
                {isAdminAdmin && (
                  <View>
                    <Controller
                      control={control}
                      name={'accountId'}
                      rules={{
                        required: true,
                      }}
                      render={() => (
                        <View>
                          <DropdownItem
                            search
                            required
                            label={t('chooseCompany')}
                            data={companies || []}
                            onChange={(e) => setValue('accountId', e.value ?? '')}
                            error={!!errors?.accountId}
                          />
                        </View>
                      )}
                    />
                    {errors.accountId && (
                      <Text style={styles.error}>
                        {errors?.accountId?.message || t('required')}
                      </Text>
                    )}
                  </View>
                )}
                <TextField<ICreateProject>
                  control={control}
                  errors={errors}
                  label={t('country')}
                  name="country"
                  required
                />
                {isState && (
                  <DropdownItem
                    search
                    label={t('state')}
                    data={usStates}
                    onChange={(e) => setValue('state', e.value ?? '')}
                  />
                )}

                {hasSubscriptionFeature('teamInvitations') && (
                  <MultiSelectDropdown
                    label={t('Project members')}
                    data={usersDropdownData}
                    onChange={(selectedItems) => {
                      setValue('usersIds', selectedItems);
                    }}
                  />
                )}

                <TextField<ICreateProject>
                  control={control}
                  errors={errors}
                  label={t('city')}
                  name="city"
                  required
                />
                <TextField<ICreateProject>
                  control={control}
                  errors={errors}
                  label={t('address')}
                  name="address"
                  required
                />
                <TextField<ICreateProject>
                  control={control}
                  errors={errors}
                  label={t('zipCode')}
                  name="zipCode"
                  required
                />
                <UploadPhoto<ICreateProject>
                  control={control}
                  errors={errors}
                  label={t('projectMap')}
                  name="mainPhoto"
                  required
                />
              </View>
              <View style={styles.buttonBox}>
                <CustomButton
                  onPress={showModal}
                  title={t('cancelButton')}
                  backgroundColor="#fff"
                  styleBtn={{ color: '#000' }}
                  styleAppBtn={{
                    borderColor: '#D0D5DD',
                    borderWidth: 1,
                    borderRadius: 8,
                    flex: 1,
                  }}
                />
                <CustomButton
                  title={t('createButton')}
                  onPress={handleSubmit(onSubmit)}
                  styleAppBtn={{
                    flex: 1,
                  }}
                />
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  formHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formHeadText: {
    color: Colors.light.text,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  formBox: {
    marginTop: 40,
    gap: 24,
  },
  registerForm: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 24,
    gap: 16,
  },
  buttonBox: {
    marginVertical: 24,
    flexDirection: 'row',
    gap: 8,
  },
  image: {
    width: 200,
    height: 200,
  },
  error: {
    borderColor: 'red',
    color: 'red',
  },
});
