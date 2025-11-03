import { useApiProject } from '@/axios/api/projects';
import { useProjects } from '@/context/projectsProvider';
import Modal from '@/modal';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropdownItem from '../dropdown';
import IconClose from '../../../assets/svgs/iconClose';
import { useForm } from 'react-hook-form';
import CustomButton from '../CustomButton/button';
import { useApiNotifications } from '@/axios/api/notification';
import Toast from 'react-native-toast-message';

import * as Notifications from 'expo-notifications';
import useGetUserInfo from '@/hooks/getUserInfo';
import { ActivityIndicator } from 'react-native-paper';

interface CreateNotificationProps {
  onSended?: () => Promise<void>;
}

export interface ICreateNotification {
  projectId: string;
  type: string;
  importance: 'critical' | 'standard';
  text: string;
}

export default function CreateNotification({ onSended }: CreateNotificationProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const { isAdminAdmin } = useGetUserInfo();

  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  const { sendNotifications } = useApiNotifications();

  const {
    handleSubmit,
    setValue,
    formState: { isValid, isSubmitting },
    watch,
  } = useForm<ICreateNotification>({
    mode: 'onChange',
    defaultValues: {
      projectId: '',
      type: '',
      importance: 'standard',
      text: '',
    },
  });

  const formValues = watch();
  const isFormValid = isValid && formValues.text.trim() !== '';

  const { projects } = useProjects();

  const { getAllProject } = useApiProject();

  const getProject = async () => {
    await getAllProject({ page: 1, rowsPerPage: 1000 });
  };

  const showModal = () => {
    setVisible(!visible);
  };

  const renamedData = useMemo(() => {
    const allProjects = isAdminAdmin
      ? [{ id: '', name: 'All Members' }, ...projects.projects]
      : projects.projects;
    return allProjects.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
  }, [projects.projects]);

  const onSubmit = async (data: ICreateNotification) => {
    const type = data.projectId ? 'project wide' : 'system wide';
    const result = await sendNotifications({ ...data, type });

    await onSended?.();

    if (result.message === 'Success') {
      Toast.show({
        type: 'success',
        text1: t(result.message),
      });
      setVisible(false);
    } else {
      Toast.show({
        type: 'error',
        text1: t(result.message) || 'Some error, try again',
      });
    }
  };

  const notificationPriority = [
    {
      value: 'standard',
      label: t('standard'),
    },
    {
      value: 'critical',
      label: t('critical'),
    },
  ];

  useEffect(() => {
    getProject();
  }, []);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener(setNotification);

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('addNotificationResponseReceivedListener', response);
      }
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  console.log('notification!notification', notification);

  return (
    <>
      <CustomButton
        title={t('createNotification')}
        onPress={showModal}
        styleAppBtn={{
          width: '60%',
        }}
      />
      <Modal visible={visible} hideModal={showModal} keyboardUp>
        <>
          <View style={styles.formHead}>
            <Text style={styles.formHeadText}>{t('createNotification')}</Text>
            <TouchableOpacity onPress={showModal}>
              <IconClose />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text>{t('createNotificationDescription')}</Text>
          </View>

          <View style={{ marginTop: 10 }}>
            <DropdownItem
              required
              data={renamedData || []}
              onChange={(e) => setValue('projectId', e.value)}
              label={t('projectNotifications')}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <DropdownItem
              required
              defaultValue={formValues.importance || 'standard'}
              data={notificationPriority || []}
              onChange={(e) => setValue('importance', e.value as 'critical' | 'standard')}
              label={t('notificationPriority')}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>
              {t('notificationMessage')}
              <Text style={styles.labelRequired}>{'*'}</Text>
            </Text>

            <View style={styles.textInputContainer}>
              <TextInput
                editable
                multiline
                numberOfLines={4}
                onChangeText={(text) => setValue('text', text)}
                style={styles.textInput}
                textAlignVertical="top"
              />
            </View>
          </View>

          <CustomButton
            title={t('sendNotification')}
            onPress={handleSubmit(onSubmit)}
            icon={
              isSubmitting ? (
                <ActivityIndicator size={14} animating color="#FFFFFF" />
              ) : (
                <></>
              )
            }
            disabled={!isFormValid || isSubmitting}
            styleAppBtn={{
              flex: 1,
              marginTop: 20,
            }}
          />
        </>
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
    color: '#0A2540',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  textInputContainer: {
    marginTop: 10,
    borderColor: '#CDD0DE',
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 100,
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    padding: 10,
    fontSize: 16,
    color: '#0A2540',
    minHeight: 100,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0A2540',
    lineHeight: 20,
  },
  labelRequired: {
    color: '#EF6F08',
  },
});
