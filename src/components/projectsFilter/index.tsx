import React from 'react';
import DropdownItem from '../dropdown';
import { useApiProject } from '@/axios/api/projects';
import { useAuth } from '@/context/AuthProvider';
import { useProjects } from '@/context/projectsProvider';
import { useTranslation } from 'react-i18next';
import { ProjectStatus } from '@/types/project';

const dataText = (t: (key: string) => string) => [
  { label: t('active'), value: 'Active' },
  { label: t('archive'), value: 'Archived' },
];

export default function ProjectsFilter() {
  const { getAllProject } = useApiProject();
  const { statusFilter, setStatusFilter } = useProjects();
  const { user } = useAuth();
  const { t } = useTranslation();

  const data = dataText(t);

  const isUserId = user?.auth.role !== 'user' ? user?.auth.id : undefined;
  const setFilter = async (e: string) => {
    if (user) await getAllProject({ userId: isUserId, status: e as ProjectStatus });
  };

  const onChange = (event: { label: string; value: string }) => {
    setFilter(event.value);
    setStatusFilter(event.value as ProjectStatus);
  };

  return (
    <DropdownItem
      data={data}
      defaultValue={statusFilter}
      onChange={onChange}
      styleContainer={{ height: 40 }}
    />
  );
}
