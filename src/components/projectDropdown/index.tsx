import React from 'react';
import DropdownItem from '../dropdown';
import { router } from 'expo-router';
import { useApiProject } from '@/axios/api/projects';
import { useTranslation } from 'react-i18next';
import { useProjects } from '@/context/projectsProvider';
import { useObservations } from '@/context/observationProvider';

export default function ProjectDropdown({
  currentId,
  redirect,
  onChange,
  label,
}: {
  currentId?: string;
  redirect?: boolean;
  onChange?: (id: string, name?: string) => void;
  label?: string;
}) {
  const { projects, setSingleProject } = useProjects();
  const { setObservation } = useObservations();
  const { getSingleProject } = useApiProject();
  const { t } = useTranslation();

  const renamedData = projects.projects.map((projects) => ({
    value: projects.id,
    label: projects.name,
  }));

  const handleChange = async (id: string, name?: string) => {
    if (onChange) {
      onChange(id, name);
      return;
    }
    if (currentId === id) return;
    if (redirect) {
      setSingleProject(null);
      setObservation({
        observations: [],
        count: 0,
        addressedCount: 0,
        inProgressCount: 0,
        notAddressedCount: 0,
      });
      router.navigate(`/auth/projects/(id)/${id}`);
    } else {
      await getSingleProject({ id });
    }
  };

  return (
    <DropdownItem
      search
      data={renamedData}
      defaultValue={currentId}
      onChange={(e) => handleChange(e.value, e.label)}
      label={label || t('chooseProject')}
    />
  );
}
